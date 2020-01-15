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
import { HourlyReportService } from "../services/hourly.report.service";
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

import { performance } from 'perf_hooks';

interface PopulatedReport {
    employee?: Employee
    startDate: Date,
    endDate: Date,
    tasks: Task[],
    totalHours: number
}

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
        const { invoiceStartDate, invoiceEndDate } = req.body;

        if(!invoiceStartDate || !invoiceEndDate) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            let start = performance.now();
            this.validate.dateFormat(invoiceStartDate, "L");
            this.validate.dateFormat(invoiceEndDate, "L");
            this.validate.dateRange(invoiceStartDate, invoiceEndDate);

            const customer = await this.validate.customerId(req.params.customerId);
            let end = performance.now();
            let timeElapsed = end - start;
            console.log(`******** Validation: ${timeElapsed.toFixed(2)} ms`);
            
            const reports = await (this.reportService as ReportService)
                .getCustomerReportsForDates(
                    customer.id, 
                    invoiceStartDate, 
                    invoiceEndDate
                );

            if(!reports.length) {
                return next(createError(404, `No reports have been submitted for Customer ID: ${customer.id} for this time period`));
            }

            const reportIds = reports.map((report) => {
                return report.id;
            });
            
            start = performance.now();
            const tasks = await (this.taskService as TaskService).getAllTasksForGroupOfReports(reportIds);
            const populatedReports = await this.getPopulatedReports(reports, tasks);
            const employeesDetails = this.getEmployeesInvoiceDetails(populatedReports);
            const invoiceTableElements = await this.getInvoiceTableElements(employeesDetails);
            end = performance.now();
            timeElapsed = end - start;
            console.log(`******** Data gathering: ${timeElapsed.toFixed(2)} ms`);

            let invoice = await this.invoiceService.getByFields({
                start_date: invoiceStartDate,
                end_date: invoiceEndDate
            });

            if(!invoice) {
                invoice = await this.invoiceService.create({
                    customer_id: customer.id,
                    start_date: invoiceStartDate,
                    end_date: invoiceEndDate,
                    dollar_amount: invoiceTableElements.invoiceTotal,
                    submitted_date: moment().format('L')
                } as unknown as Invoice);
            }
            
            let invoiceParams: InvoiceParameters = this.buildInvoicePdfParams(customer, invoice, invoiceTableElements)

            start = performance.now();
            const invoicePdfPath = await this.invoiceService.generateInvoicePdf(invoiceParams);
            end = performance.now();
            timeElapsed = end - start;
            console.log(`******** Generate invoice PDF: ${timeElapsed.toFixed(2)} ms`);

            const invoicePdfAttachment: EmailAttachment = {
                filename: `Lulosoft Invoice #${invoiceParams.invoiceNumber}.pdf`,
                path: invoicePdfPath
            }

            const hourlyReportPdfAttachments: EmailAttachment[] = await this.getHourlyReportPdfAttachments(populatedReports);

            const attachments: EmailAttachment[] = [invoicePdfAttachment].concat(hourlyReportPdfAttachments);

            start = performance.now();
            await this.sendInvoiceEmail(customer, invoiceParams, attachments);
            end = performance.now();
            timeElapsed = end - start;
            console.log(`******** Send email: ${timeElapsed.toFixed(2)} ms`);

            res.sendStatus(200);
        } catch (error) {
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

    private async getHourlyReportPdfAttachments(populatedReports: PopulatedReport[]) {
        let hourlyReportPdfAttachments = [];

        let start = performance.now();
        for (const report of populatedReports) {
            const hourlyReportParams = await this.buildHourlyReportParams(report);
            
            let start = performance.now();
            const hourlyReportPdfPath = await this.hourlyReportService.generateHourlyReportPdf(hourlyReportParams);
            let end = performance.now();
            let timeElapsed = end - start;
            console.log(`******** Generate single hourly report PDF: ${timeElapsed.toFixed(2)} ms`);

            hourlyReportPdfAttachments.push({
                filename: `Lulosoft Hourly Report - ${hourlyReportParams.employeeName} - ${hourlyReportParams.reportPeriod}.pdf`,
                path: hourlyReportPdfPath
            });
        }
        let end = performance.now();
        let timeElapsed = end - start;
        console.log(`******** Generate all hourly report PDFs: ${timeElapsed.toFixed(2)} ms`);

        return hourlyReportPdfAttachments;
    }

    private async buildHourlyReportParams(report: PopulatedReport) {
        return {
            employeeName: toTitleCase(`${report.employee!.first_name} ${report.employee!.last_name}`),
            reportPeriod: `${moment(report.startDate).format("MM-DD-YYYY")} to ${moment(report.endDate).format("MM-DD-YYYY")}`,
            tableRows: await this.getHourlyReportTasksTableElements(report.tasks),
            totalHours: report.totalHours.toString()
        };
    }

    private buildInvoicePdfParams(customer: Customer, invoice: Invoice, invoiceTableElements: { elements: ObjectLiteral; invoiceTotal: number; }): InvoiceParameters {
        return {
            invoiceCustomerName: toTitleCase(customer.name),
            invoiceCustomerAddressLine1: toTitleCase(customer.address_line_1),
            invoiceCustomerAddressLine2: customer.address_line_2 ? toTitleCase(customer.address_line_2) : "",
            invoiceCustomerAddressLine3: `${toTitleCase(customer.city)}, ${customer.state.toUpperCase()} ${customer.zip_code}`,
            invoiceNumber: invoice.id.toString(),
            invoiceDate: moment(invoice.submitted_date).format('L'),
            invoiceDueDate: moment().add(this.invoiceTermNumberOfDays, 'days').format('L'),
            invoiceTerms: `${this.invoiceTermNumberOfDays} days`,
            invoiceDescriptionList: invoiceTableElements.elements.descriptionList,
            invoiceQuantityList: invoiceTableElements.elements.quantityList,
            invoiceRateList: invoiceTableElements.elements.rateList,
            invoiceAmountList: invoiceTableElements.elements.amountList,
            invoiceTotal: `$${toMoney(invoiceTableElements.invoiceTotal)}`
        };
    }

    private async getPopulatedReports(reports: Report[], tasks: Task[]) {
        let populatedReports: PopulatedReport[] = [];

        for (const report of reports) {
            let reportTasks = this.getTasksByReportId(tasks, report.id);
            const reducer = (previousValue: number, currentValue: Task) => { 
                return previousValue + Number.parseInt(currentValue.hours) 
            };
            const totalHours = reportTasks.reduce(reducer, 0)

            let populatedReport: PopulatedReport = {
                employee: await this.employeeService.get(report.employee_id.toString()),
                tasks: reportTasks,
                startDate: report.start_date,
                endDate: report.end_date,
                totalHours
            };
            populatedReports.push(populatedReport);
        }

        return populatedReports;
    }

    private async getHourlyReportTasksTableElements(tasks: Task[]) {
        let tableElements = "";
        for (let i = 0; i < tasks.length; i++) {
            tableElements += `<tr><td>${moment(tasks[i].date_performed).format('L')}</td><td>${tasks[i].description}</td><td class='align-right'>${tasks[i].hours}</td></tr>`
        }
        return tableElements;
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

    private getTasksByReportId(tasks: Task[], reportId: number) {
        return tasks.filter((task) => {
            return task.report_id === reportId;
        })
    }

}