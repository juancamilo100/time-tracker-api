const fs = require('fs');
const path = require('path');

module.exports = (hash) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err,data) => {
        if (err) {
            return console.log(err);
        }
        let result = data;
        const config = result.match(/config([\w]{0,}).js"><\/script>/);
        result = result.replace(config[0], `config${hash}.js"></script>`);
        fs.writeFile(path.join(__dirname, 'index.html'), result, 'utf8', (err) => {
            if (err) return console.log(err);
        });
    });
}