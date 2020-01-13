import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import util from 'util';
import { ObjectLiteral } from '../../types/generics';
import puppeteer, { PDFOptions } from 'puppeteer'
import { addHashToFileName } from '../utils/formatter';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

interface PdfDimensions {
    pixelWidth: number,
    pixelHeight: number
}

export default class HtmlToPdfService<T> {
    private pdfOutputBasePath: string = path.join(__dirname, '/../pdf');

    constructor(
        private envVarNames: T & ObjectLiteral,
        private paramsPlaceholderFilePath: string,
        private htmlParamsConfigFilePath: string,
        private htmlFilePath: string,
        private pdfDimensions: PdfDimensions) {}

    public async generatePdf(pdfOutputFileName: string, pdfParams: T) {
        try {
            const hash = await this.setPdfParameters(pdfParams);
            const pdfOutputFilePath = `${this.pdfOutputBasePath}/${pdfOutputFileName}.pdf`;
            await this.createPdfFromHeadlessBrowser(pdfOutputFilePath);
            
            const paramsFilePath = addHashToFileName(this.htmlParamsConfigFilePath, hash).newPath;
            await this.deleteParamsFile(paramsFilePath);

            return pdfOutputFilePath;
        } catch (error) {
            const message = 'Something went wrong while generating the PDF';
            console.error(`${message}: ${error}`);
            throw new Error(message);
        }
    }

    private async createPdfFromHeadlessBrowser(pdfOutputFilePath: string) {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--disable-web-security',
                '--allow-file-access-from-files'
            ]
        });
        const page = await browser.newPage();
        await page.goto(`file:///${this.htmlFilePath}`, { waitUntil: 'load', timeout: 10000 });
        await page.pdf({
            path: pdfOutputFilePath,
            printBackground: true,
            width: `${this.pdfDimensions.pixelWidth}px`,
            height: `${this.pdfDimensions.pixelHeight}px`
        } as unknown as PDFOptions);
        await browser.close();
    }

    private async updateParamsFileName(newFileName: string) {
        let content = await readFile(this.htmlFilePath, 'utf8');
        const paramsFileNameWithoutExtension = this.getFileNameWithoutExtension(this.htmlParamsConfigFilePath);
        const params = content.match(new RegExp(`${paramsFileNameWithoutExtension}([\\w]{0,}).js\"><\\/script>`));
        content = content.replace(params![0], `${newFileName}"></script>`);
        await writeFile(this.htmlFilePath, content, 'utf8');
    }

    private async setPdfParameters(pdfParams: T) {
        this.setEnvironmentVariables(pdfParams);
        
        const hash = crypto.randomBytes(16).toString('hex');

        let params = await readFile(this.paramsPlaceholderFilePath, 'utf8');
        params = this.extractAndReplacePlaceholders(params);

        const populatedParamsConfigFilePath = addHashToFileName(this.htmlParamsConfigFilePath, hash);

        await writeFile(populatedParamsConfigFilePath.newPath, params, 'utf8');
        await this.updateParamsFileName(populatedParamsConfigFilePath.newFileName);
        return hash;
    }

    private setEnvironmentVariables(pdfParams: T & ObjectLiteral) {
        for (const key in this.envVarNames) {
            process.env[this.envVarNames[key]] = pdfParams[key];
        }
    }

    private extractAndReplacePlaceholders(data: string) {
        const placeholders = data.match(/\$env([^,\n\r}{}]+)/g);

        placeholders!.forEach((placeholder) => {
            const envVar = placeholder.replace(/\$env\./g, '');
            data = data.replace(placeholder, `"${process.env[envVar]}"`);
        });

        return data;
    }

    private async deleteParamsFile(paramsFilePath: string) {
        try {
            await deleteFile(paramsFilePath);
        } catch (error) {
            console.error(error);
        }
    }

    private getFileNameWithoutExtension(filePath: string) {
        const pathSections = filePath.split("/");
        const fileFullName = pathSections[pathSections.length - 1];
        return fileFullName.split(".")[0];
    }
}