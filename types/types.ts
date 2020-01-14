import { ObjectLiteral } from './generics';

export interface ReportPeriod {
    start: Date,
    end: Date
}

export interface InvoiceParameters extends ObjectLiteral {
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

export interface HourlyReportParameters extends ObjectLiteral {
    employeeName: string,
    reportPeriod: string,
    tableRows: string,
    totalHours: string
}