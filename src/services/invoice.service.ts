import path from 'path';
import Invoice from '../database/entities/invoice.entity';
import { EntitySchema } from 'typeorm';
import BaseDataService from './base.data.service';
import { InvoiceParameters } from '../../types/types';
import moment from 'moment';
import HtmlToPdfService from './pdf.service';

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
}

export default new InvoiceService();