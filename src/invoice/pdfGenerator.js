const path = require('path');
const setEnv = require('./setEnvironment.js');
const puppeteer = require('puppeteer');

process.env.NAME = "Juanchoaaaaa";

const start = new Date();
(async () => {
    try {
        await setEnv(path.join(__dirname, './temp_config.js'), path.join(__dirname));
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("file:///" + path.join(__dirname, '/report.html'), {waitUntil: 'networkidle2'});
        await page.pdf({
            path: 'report.pdf',
            format: 'letter'
        });

        await browser.close();    
    } catch (error) {
        console.log(error);
    }
})();

const end = new Date() - start
console.info('Execution time: %dms', end)