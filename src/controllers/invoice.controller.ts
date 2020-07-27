import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import moment from 'moment';
import IDataService from "../interfaces/data.service.interface";
import Report from '../database/entities/report.entity';
import Employee from "../database/entities/employee.entity";
import Task from '../database/entities/task.entity';
import { InvoiceService } from "../services/invoice.service";
import { HourlyReportService, PopulatedReport } from "../services/hourly.report.service";
import Validator from '../utils/validator';
import createError from "http-errors";
import { ReportService } from '../services/report.service';
import { TaskService } from '../services/task.service';
import { ObjectLiteral } from '../../types/generics';
import Invoice from '../database/entities/invoice.entity';
import { InvoiceParameters } from "../../types/types";
import IEmailService, { EmailAttachment } from '../interfaces/email.service.interface';
import { INVOICE_EMAIL_SENDER_ADDRESS } from '../../config';
import { toTitleCase, toMoney } from '../utils/formatter';
import Customer from "../database/entities/customer.entity";

export default class InvoiceController {
    constructor(
        private reportService: IDataService<Report>,
        private employeeService: IDataService<Employee>,
        private taskService: IDataService<Task>,
        private invoiceService: InvoiceService,
        private hourlyReportService: HourlyReportService,
        private emailService: IEmailService,
        private validate: Validator) {}
        private invoiceTermNumberOfDays = 14;

    public generateInvoice: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const { reportIds, invoiceStartDate, invoiceEndDate } = req.body;
        console.log("Starting invoicing");
        

        this.validate.dateFormat(invoiceStartDate, "L");
        this.validate.dateFormat(invoiceEndDate, "L");
        this.validate.dateRange(invoiceStartDate, invoiceEndDate);

        if(!reportIds || reportIds.length == 0) {
            return next(createError(400, "Report ID's missing"));
        }

        try {
            const customer = await this.validate.customerId(req.params.customerId);
            const reports = await this.reportService
                .getAllByIds(reportIds.map((id: string) => Number.parseInt(id)));
            
            if(!reports.length) {
                return next(createError(404, `No reports were found with provided IDs`));
            }

            this.validate.reportsAreInvoiceable(customer.id, reports);

            const populatedReports = await this.getPopulatedReports(reports);
            const employeesDetails = this.getEmployeesInvoiceDetails(populatedReports);
            const invoiceTableElements = await this.getInvoiceTableElements(employeesDetails);

            const invoice: Invoice = await this.invoiceService.create({
                customer_id: customer.id,
                start_date: invoiceStartDate,
                end_date: invoiceEndDate,
                dollar_amount: invoiceTableElements.invoiceTotal,
                due_date: moment().add(this.invoiceTermNumberOfDays, 'days')
            } as unknown as Invoice);

            await (this.reportService as ReportService).assignReportsToInvoice(invoice.id, reports);
            
            let invoiceParams: InvoiceParameters = this.buildInvoicePdfParams(customer, invoice, invoiceTableElements)

            const invoicePdfPath = await this.invoiceService.generateInvoicePdf(invoiceParams);
            const invoicePdfAttachment: EmailAttachment = {
                filename: `Lulosoft Invoice #${invoiceParams.invoiceNumber}.pdf`,
                path: invoicePdfPath
            }

            const hourlyReportPdfAttachments: EmailAttachment[] = await this.hourlyReportService.getHourlyReportPdfAttachments(populatedReports);

            const attachments: EmailAttachment[] = [invoicePdfAttachment].concat(hourlyReportPdfAttachments);
            await this.sendInvoiceEmail(customer, invoiceParams, attachments);
            
            res.send({
                invoiceId: invoice.id
            });
        } catch (error) {
            console.error(error);
            return next(createError(500, error));
        }
    }

    private async sendInvoiceEmail(customer: Customer, invoiceParams: InvoiceParameters, attachments: EmailAttachment[]) {
        await this.emailService.sendMail({
            from: INVOICE_EMAIL_SENDER_ADDRESS!,
            to: customer.email,
            subject: `Invoice #${invoiceParams.invoiceNumber} Lulosoft`,
            body: "Hello,\n\nPlease find attached the invoice and hourly report for this cycle.\n\nRegards,\n\n",
            attachments
        });
    }

    private buildInvoicePdfParams(customer: Customer, invoice: Invoice, invoiceTableElements: { elements: ObjectLiteral; invoiceTotal: number; }): InvoiceParameters {
        return {
            invoiceCustomerName: toTitleCase(customer.name),
            invoiceCustomerAddressLine1: toTitleCase(customer.address_line_1),
            invoiceCustomerAddressLine2: customer.address_line_2 ? toTitleCase(customer.address_line_2) : "",
            invoiceCustomerAddressLine3: `${toTitleCase(customer.city)}, ${customer.state.toUpperCase()} ${customer.zip_code}`,
            invoiceNumber: invoice.id.toString(),
            invoiceDate: moment(invoice.submitted_date).format('L'),
            invoiceDueDate: moment(invoice.due_date).format('L'),
            invoiceTerms: `${this.invoiceTermNumberOfDays} days`,
            invoiceDescriptionList: invoiceTableElements.elements.descriptionList,
            invoiceQuantityList: invoiceTableElements.elements.quantityList,
            invoiceRateList: invoiceTableElements.elements.rateList,
            invoiceAmountList: invoiceTableElements.elements.amountList,
            invoiceTotal: `$${toMoney(invoiceTableElements.invoiceTotal)}`
        };
    }

    private async getPopulatedReports(reports: Report[]) {
        let populatedReports: PopulatedReport[] = [];

        for (const report of reports) {
            let tasks = await (this.taskService as TaskService).getTasksByReportId(report.id);
            const reducer = (previousValue: number, currentValue: Task) => { 
                return previousValue + Number.parseInt(currentValue.hours) 
            };
            const totalHours = tasks.reduce(reducer, 0)

            let populatedReport: PopulatedReport = {
                employee: await this.employeeService.get(report.employee_id.toString()),
                tasks,
                startDate: report.start_date,
                endDate: report.end_date,
                totalHours
            };
            populatedReports.push(populatedReport);
        }

        return populatedReports;
    }

    private async getInvoiceTableElements(employees: ObjectLiteral) {
        let elements = {
            descriptionList: "",
            quantityList: "",
            rateList: "",
            amountList: ""
        } as ObjectLiteral;

        let invoiceTotal = 0;

        for (const employeeId of Object.keys(employees)) {
            const amount = employees[employeeId].totalHours * employees[employeeId].customerRate;
            invoiceTotal += amount;

            elements.descriptionList += `<div>* ${toTitleCase(employees[employeeId].jobTitle)}</div>`;
            elements.quantityList += `<div>${employees[employeeId].totalHours}</div>`;
            elements.rateList += `<div>$${toMoney(employees[employeeId].customerRate)}</div>`;
            elements.amountList += `<div>$${toMoney(amount)}</div>`;
        }

        return {elements, invoiceTotal};
    }

    private getEmployeesInvoiceDetails(populatedReports: PopulatedReport[]) {
        const employees = {} as ObjectLiteral;

        populatedReports.forEach((report: PopulatedReport) => {
            employees[report.employee!.id] = employees[report.employee!.id] || {};

            const currentTotalHours = employees[report.employee!.id]['totalHours'];
            employees[report.employee!.id]['totalHours'] =  currentTotalHours ? currentTotalHours + report.totalHours : report.totalHours;
            employees[report.employee!.id]['jobTitle'] = report.employee!.job_title;
            employees[report.employee!.id]['customerRate'] = report.employee!.customer_rate;
        });

        return employees;
    }
}