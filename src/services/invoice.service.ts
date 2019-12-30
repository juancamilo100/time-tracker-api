import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import util from 'util';
import puppeteer, { PDFOptions } from 'puppeteer'
import { ObjectLiteral } from '../../types/generics';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

interface InvoiceParameters extends ObjectLiteral {
    invoiceCustomerName: string;
    invoiceCustomerAddressLine1: string;
    invoiceCustomerAddressLine2: string;
    invoiceCustomerAddressLine3: string;
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    invoiceTerms: string;
    invoiceDescriptionList: string;
    invoiceQuantityList: string;
    invoiceRateList: string;
    invoiceAmountList: string;
    invoiceTotal: string;
}

const invoiceEnvVarNames: InvoiceParameters = {
    invoiceCustomerName: 'INVOICE_CUSTOMER_NAME',
    invoiceCustomerAddressLine1: 'INVOICE_CUSTOMER_ADDRESS_LINE_1',
    invoiceCustomerAddressLine2: 'INVOICE_CUSTOMER_ADDRESS_LINE_2',
    invoiceCustomerAddressLine3: 'INVOICE_CUSTOMER_ADDRESS_LINE_3',
    invoiceNumber: 'INVOICE_NUMBER',
    invoiceDate: 'INOVICE_DATE',
    invoiceDueDate: 'INOVICE_DUE_DATE',
    invoiceTerms: 'INOVICE_TERMS',
    invoiceDescriptionList: 'INOVICE_DESCRIPTION_LIST',
    invoiceQuantityList: 'INOVICE_QUANTITY_LIST',
    invoiceRateList: 'INOVICE_RATE_LIST',
    invoiceAmountList: 'INOVICE_AMOUNT_LIST',
    invoiceTotal: 'INOVICE_TOTAL'
}

export class InvoiceService {
    constructor() {}

    public async generateInvoicePdf(invoiceParams: InvoiceParameters) {
        try {
            const hash = await this.setInvoiceParameters(invoiceParams);
            const configFileName = `config${hash}.js`;
            const pdfFilePath = path.join(__dirname, `/../invoice/invoice${hash}.pdf`)
            
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            
            await page.goto("file:///" + path.join(__dirname, '/../invoice/invoice.html'), { waitUntil: 'networkidle2' });
            await page.pdf({
                path: pdfFilePath,
                format: 'letter'
            } as unknown as PDFOptions);
            await browser.close();
            
            await this.deleteConfigFile(configFileName);

            return pdfFilePath;
        } catch (error) {
            const message = 'Something went wrong while setting invoice parameters';
            console.error(`${message}: ${error}`);
            throw new Error(message);
        }
    }

    private async updateConfigFileName(newFileName: string) {
        let content = await readFile(path.join(__dirname, '/../invoice/invoice.html'), 'utf8');
        const config = content.match(/config([\w]{0,}).js"><\/script>/);
        content = content.replace(config![0], `${newFileName}"></script>`);

        await writeFile(path.join(__dirname, '/../invoice/invoice.html'), content, 'utf8');
    }

    private async setInvoiceParameters(invoiceParams: InvoiceParameters) {
        this.setEnvironmentVariables(invoiceParams);
        
        const hash = crypto.randomBytes(16).toString('hex');

        let data = await readFile(path.join(__dirname, '/../invoice/configPlaceholder.js'), 'utf8');
        data = this.extractAndReplacePlaceholders(data);

        const configFileName = `config${hash}.js`;

        await writeFile(path.join(__dirname, `/../invoice/${configFileName}`), data, 'utf8');
        await this.updateConfigFileName(configFileName);
        return hash;
    }

    private setEnvironmentVariables(invoiceParams: InvoiceParameters) {
        for (const key in invoiceEnvVarNames) {
            process.env[invoiceEnvVarNames[key]] = invoiceParams[invoiceEnvVarNames[key]];
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

    private async deleteConfigFile(configFileName: string) {
        await deleteFile(path.join(__dirname, `/../invoice/${configFileName}`);
    }
}