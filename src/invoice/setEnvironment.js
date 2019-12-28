const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

module.exports = async (filePath, outputPath) => {
    const hash = crypto.randomBytes(16).toString('hex');
    let data = await readFile(filePath, 'utf8');
    const envVars = data.match(/\$env([^,\n\r}{}]+)/g);
    
    for(let i in envVars) {
        const envVar = envVars[i].replace(/\$env\./g, '');
        data = data.replace(envVars[i], `"${process.env[envVar]}"`);
    }

    await writeFile(path.join(outputPath, `config.js`) , data, 'utf8');
    return hash;
}
