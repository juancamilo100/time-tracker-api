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
import Validator from '../utils/validator';
import createError from "http-errors";
import { ReportService } from '../services/report.service';
import { TaskService } from '../services/task.service';
import { ObjectLiteral } from '../../types/generics';
import Invoice from '../database/entities/invoice.entity';
import { InvoiceParameters } from "../../types/types";
import IEmailService, { EmailAttachment } from '../interfaces/email.service.interface';
import { INVOICE_EMAIL_SENDER_ADDRESS } from '../../config';
import { toTitleCase } from '../utils/formatter';

export default class InvoiceController {
    constructor(
        private reportService: IDataService<Report>,
        private employeeService: IDataService<Employee>,
        private taskService: IDataService<Task>,
        private invoiceService: InvoiceService,
        private emailService: IEmailService,
        private validate: Validator) {}
        private invoiceTermNumberOfDays = 14;

        public generateInvoice: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            const { invoiceStartDate, invoiceEndDate } = req.body;
    
            if(!invoiceStartDate || !invoiceEndDate) {
                return next(createError(400, "Incomplete request"));
            }
    
            try {
                this.validate.dateFormat(invoiceStartDate);
                this.validate.dateFormat(invoiceEndDate);
                this.validate.dateRange(invoiceStartDate, invoiceEndDate);

                const customer = await this.validate.customerId(req.params.customerId);
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
                
                const tasks = await (this.taskService as TaskService).getAllTasksForGroupOfReports(reportIds);
                const employees = this.getEmployeesInvoiceDetails(reports, tasks);
                const tableElements = await this.getTableElements(employees);

                let invoice = await this.invoiceService.getByFields({
                    start_date: invoiceStartDate,
                    end_date: invoiceEndDate
                });

                if(!invoice) {
                    invoice = await this.invoiceService.create({
                        customer_id: customer.id,
                        start_date: invoiceStartDate,
                        end_date: invoiceEndDate,
                        dollar_amount: tableElements.invoiceTotal,
                        submitted_date: moment().format('L')
                    } as unknown as Invoice);
                }
                
                let invoiceParams: InvoiceParameters = {
                    invoiceCustomerName: toTitleCase(customer.name),
                    invoiceCustomerAddressLine1: toTitleCase(customer.address_line_1),
                    invoiceCustomerAddressLine2: customer.address_line_2 ? toTitleCase(customer.address_line_2) : "",
                    invoiceCustomerAddressLine3: `${toTitleCase(customer.city)}, ${customer.state.toUpperCase()} ${customer.zip_code}`,
                    invoiceNumber: invoice.id,
                    invoiceDate: moment(invoice.submitted_date).format('L'),
                    invoiceDueDate: moment().add(this.invoiceTermNumberOfDays, 'days').format('L'),
                    invoiceTerms: `${this.invoiceTermNumberOfDays} days`,
                    invoiceDescriptionList: tableElements.elements.descriptionList,
                    invoiceQuantityList: tableElements.elements.quantityList,
                    invoiceRateList: tableElements.elements.rateList,
                    invoiceAmountList: tableElements.elements.amountList,
                    invoiceTotal: `$${tableElements.invoiceTotal}`
                }
                
                const invoicePdfPath = await this.invoiceService.generateInvoicePdf(invoiceParams);
                await this.emailService.sendMail({  
                    from: INVOICE_EMAIL_SENDER_ADDRESS!,
                    to: customer.email,
                    subject: `Invoice #${invoiceParams.invoiceNumber} Lulosoft`,
                    body: "Hello,\n\nPlease find attached the invoice and hourly report for this cycle.\n\nRegards,\n\n",
                    attachments: [{
                        filename: `Lulosoft Invoice #${invoiceParams.invoiceNumber}.pdf`,
                        path: invoicePdfPath
                    }]
                });

                res.send(200);
            } catch (error) {
                return next(createError(500, error));
            }
        }
    
        private async getTableElements(employees: ObjectLiteral) {
            let elements = {
                descriptionList: "",
                quantityList: "",
                rateList: "",
                amountList: ""
            } as ObjectLiteral;

            let invoiceTotal = 0;
    
            for (const employeeId of Object.keys(employees)) {
                const employee = await this.employeeService.get(employeeId);
                const amount = employees[employeeId].totalHours * employee!.customer_rate;
                invoiceTotal += amount;
    
                elements.descriptionList += `<div>* ${toTitleCase(employee!.job_title)} Software</div>`;
                elements.quantityList += `<div>${employees[employeeId].totalHours}</div>`;
                elements.rateList += `<div>$${employee!.customer_rate}</div>`;
                elements.amountList += `<div>$${amount}</div>`;
            }
    
            return {elements, invoiceTotal};
        }
    
        private getEmployeesInvoiceDetails(reports: any[], tasks: any[]) {
            const employees = {} as ObjectLiteral;
            reports.forEach((report: Report) => {
                let totalHours = 0;
                employees[report.employee_id] = {};
                this.getTasksByReportId(tasks, report.id).forEach((task) => {
                    totalHours += Number.parseInt(task.hours);
                });
                employees[report.employee_id]['totalHours'] = totalHours;
            });
            return employees;
        }
    
        private getTasksByReportId(tasks: Task[], reportId: number) {
            return tasks.filter((task) => {
                return task.report_id === reportId;
            })
        }

}