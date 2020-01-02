// import moduleName from 'path'
import puppeteer, { PDFOptions } from 'puppeteer'
// import moduleName from 'module'
// import moduleName from 'module'
const path = require('path');
const envVars = require('./invoiceEnvVarNames');




(async () => {
    try {
        // await setEnv(path.join(__dirname, './temp_config.js'), path.join(__dirname));
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("file:///" + path.join(__dirname, '/invoice.html'), { waitUntil: 'networkidle2' });
        await page.pdf({
            path: 'invoice.pdf',
            format: 'letter'
        } as unknown as PDFOptions);

        await browser.close();    
    } catch (error) {
        console.log(error);
    }
})();