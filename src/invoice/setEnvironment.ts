const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export const setEnvironment = async (filePath: string, outputPath: string) => {
    const hash = crypto.randomBytes(16).toString('hex');
    let data = await readFile(filePath, 'utf8');
    const envVars = data.match(/\$env([^,\n\r}{}]+)/g);
    
    for(let i in envVars) {
        const envVar = envVars[i].replace(/\$env\./g, '');
        data = data.replace(envVars[i], `"${process.env[envVar]}"`);
    }

    await writeFile(path.join(outputPath, `config${hash}.js`) , data, 'utf8');
    return hash;
}
