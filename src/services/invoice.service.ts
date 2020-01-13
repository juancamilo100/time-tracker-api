// import fs from 'fs';
import path from 'path';
// import crypto from 'crypto';
// import util from 'util';
// import puppeteer, { PDFOptions } from 'puppeteer'
import Invoice from '../database/entities/invoice.entity';
import { EntitySchema } from 'typeorm';
import BaseDataService from './base.data.service';
import { InvoiceParameters } from '../../types/types';
import moment from 'moment';
import HtmlToPdfService from './pdf.service';

// const readFile = util.promisify(fs.readFile);
// const writeFile = util.promisify(fs.writeFile);
// const deleteFile = util.promisify(fs.unlink);

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
    private htmlToPdfService = new HtmlToPdfService<InvoiceParameters>(
        invoiceEnvVarNames,
        path.join(__dirname, '/../invoice/invoiceParamsPlaceholder.js'),
        path.join(__dirname, '/../invoice/invoiceParams.js'),
        path.join(__dirname, '/../invoice/invoice.html'),
        {
            pixelWidth: 1300,
            pixelHeight: 1625
        }
    )

    constructor() {
        super({ 
            schema: Invoice as unknown as EntitySchema<Invoice>,
            alias: "invoice"
        });
    }

    public async generateInvoicePdf(invoiceParams: InvoiceParameters): Promise<string> {
        const invoicePdfFileName = `invoice-${moment(invoiceParams.invoiceDate).format("MM.DD.YYYY")}-${invoiceParams.invoiceNumber}`;
        return this.htmlToPdfService.generatePdf(invoicePdfFileName, invoiceParams);
    }

    // public async generateInvoicePdf(invoiceParams: InvoiceParameters) {
    //     try {
    //         const hash = await this.setInvoiceParameters(invoiceParams);
    //         const paramsFileName = `invoiceParams${hash}.js`;
    //         const pdfFilePath = path.join(__dirname, `/../invoice/invoice-${moment(invoiceParams.invoiceDate).format("DD.MM.YYYY")}-${invoiceParams.invoiceNumber}.pdf`)
            
    //         await this.createPdfFromHeadlessBrowser(pdfFilePath);
    //         await this.deleteParamsFile(paramsFileName);

    //         return pdfFilePath;
    //     } catch (error) {
    //         const message = 'Something went wrong while generating invoice PDF';
    //         console.error(`${message}: ${error}`);
    //         throw new Error(message);
    //     }
    // }

    // private async createPdfFromHeadlessBrowser(pdfFilePath: string) {
    //     const browser = await puppeteer.launch({
    //         headless: true,
    //         args: [
    //             '--disable-web-security',
    //             '--allow-file-access-from-files'
    //         ]
    //     });
    //     const page = await browser.newPage();
    //     await page.goto("file:///" + path.join(__dirname, '/../invoice/invoice.html'), { waitUntil: 'load', timeout: 10000 });
    //     await page.pdf({
    //         path: pdfFilePath,
    //         printBackground: true,
    //         width: '1300px',
    //         height: '1625px'
    //     } as unknown as PDFOptions);
    //     await browser.close();
    // }

    // private async updateParamsFileName(newFileName: string) {
    //     let content = await readFile(path.join(__dirname, '/../invoice/invoice.html'), 'utf8');
    //     // const params = content.match(/invoiceParams([\w]{0,}).js"><\/script>/);
    //     const something = "invoiceParams";
    //     // const params = content.match(new RegExp('invoiceParams([\\w]{0,}).js\"><\\/script>'));
    //     const params = content.match(new RegExp(`${something}([\\w]{0,}).js\"><\\/script>`));
    //     content = content.replace(params![0], `${newFileName}"></script>`);

    //     await writeFile(path.join(__dirname, '/../invoice/invoice.html'), content, 'utf8');
    // }

    // private async setInvoiceParameters(invoiceParams: InvoiceParameters) {
    //     this.setEnvironmentVariables(invoiceParams);
        
    //     const hash = crypto.randomBytes(16).toString('hex');

    //     let params = await readFile(path.join(__dirname, '/../invoice/invoiceParamsPlaceholder.js'), 'utf8');
    //     params = this.extractAndReplacePlaceholders(params);

    //     const paramsFileName = `invoiceParams${hash}.js`;

    //     await writeFile(path.join(__dirname, `/../invoice/${paramsFileName}`), params, 'utf8');
    //     await this.updateParamsFileName(paramsFileName);
    //     return hash;
    // }

    // private setEnvironmentVariables(invoiceParams: InvoiceParameters) {
    //     for (const key in invoiceEnvVarNames) {
    //         process.env[invoiceEnvVarNames[key]] = invoiceParams[key];
    //     }
    // }

    // private extractAndReplacePlaceholders(data: string) {
    //     const placeholders = data.match(/\$env([^,\n\r}{}]+)/g);

    //     placeholders!.forEach((placeholder) => {
    //         const envVar = placeholder.replace(/\$env\./g, '');
    //         data = data.replace(placeholder, `"${process.env[envVar]}"`);
    //     });

    //     return data;
    // }

    // private async deleteParamsFile(paramsFileName: string) {
    //     try {
    //         await deleteFile(path.join(__dirname, `/../invoice/${paramsFileName}`));
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
}

export default new InvoiceService();