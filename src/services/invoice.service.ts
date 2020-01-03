import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import util from 'util';
import puppeteer, { PDFOptions } from 'puppeteer'
import Invoice from '../database/entities/invoice.entity';
import { EntitySchema } from 'typeorm';
import BaseDataService from './base.service';
import { InvoiceParameters } from '../../types/types';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const deleteFile = util.promisify(fs.unlink);

export const invoiceEnvVarNames: InvoiceParameters = {
    invoiceCustomerName: 'INVOICE_CUSTOMER_NAME',
    invoiceCustomerAddressLine1: 'INVOICE_CUSTOMER_ADDRESS_LINE_1',
    invoiceCustomerAddressLine2: 'INVOICE_CUSTOMER_ADDRESS_LINE_2',
    invoiceCustomerAddressLine3: 'INVOICE_CUSTOMER_ADDRESS_LINE_3',
    invoiceNumber: 'INVOICE_NUMBER',
    invoiceDate: 'INVOICE_DATE',
    invoiceDueDate: 'INVOICE_DUE_DATE',
    invoiceTerms: 'INVOICE_TERMS',
    invoiceDescriptionList: 'INVOICE_DESCRIPTION_LIST',
    invoiceQuantityList: 'INVOICE_QUANTITY_LIST',
    invoiceRateList: 'INVOICE_RATE_LIST',
    invoiceAmountList: 'INVOICE_AMOUNT_LIST',
    invoiceTotal: 'INVOICE_TOTAL'
}

export class InvoiceService extends BaseDataService<Invoice> {
    constructor() {
        super({
            schema: Invoice as unknown as EntitySchema<Invoice>,
            alias: "invoice"
        });
    }

    public async generateInvoicePdf(invoiceParams: InvoiceParameters) {
        try {
            const hash = await this.setInvoiceParameters(invoiceParams);
            // const configFileName = `config${hash}.js`;
            const pdfFilePath = path.join(__dirname, `/../invoice/invoice${hash}.pdf`)
            
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            
            await page.goto("file:///" + path.join(__dirname, '/../invoice/invoice.html'), { waitUntil: 'load', timeout: 10000 });
            await page.pdf({
                path: pdfFilePath,
                format: 'letter'
            } as unknown as PDFOptions);
            await browser.close();

            // await this.deleteConfigFile(configFileName);

            return pdfFilePath;
        } catch (error) {
            const message = 'Something went wrong while generating invoice PDF';
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

        let config = await readFile(path.join(__dirname, '/../invoice/configPlaceholder.js'), 'utf8');
        config = this.extractAndReplacePlaceholders(config);

        const configFileName = `config.js`;

        await writeFile(path.join(__dirname, `/../invoice/${configFileName}`), config, 'utf8');
        // await this.updateConfigFileName(configFileName);
        return hash;
    }

    private setEnvironmentVariables(invoiceParams: InvoiceParameters) {
        for (const key in invoiceEnvVarNames) {
            process.env[invoiceEnvVarNames[key]] = invoiceParams[key];
        }
        console.log(process.env);
        
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
        try {
            await deleteFile(path.join(__dirname, `/../invoice/${configFileName}`));
        } catch (error) {
            console.error(error);
        }
    }
}

export default new InvoiceService();