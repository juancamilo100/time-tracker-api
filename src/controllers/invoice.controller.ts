import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import IDataService from "../interfaces/dataService.interface";
import Customer from '../database/entities/customer.entity';
import Report from '../database/entities/report.entity';
import Employee from "../database/entities/employee.entity";
import Task from '../database/entities/task.entity';
import { InvoiceService } from "../services/invoice.service";
import { Validator } from '../utils/validator';
import createError from "http-errors";
import { ReportService } from '../services/report.service';
import { TaskService } from '../services/task.service';
import { ObjectLiteral } from '../../types/generics';

export default class InvoiceController {
    constructor(
        private reportService: IDataService<Report>,
        private employeeService: IDataService<Employee>,
        private taskService: IDataService<Task>,
        private invoiceService: InvoiceService,
        private validate: Validator) {}

        public generateInvoice: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
            const { invoiceStartDate, invoiceEndDate } = req.body;
    
            if(!invoiceStartDate || !invoiceEndDate) {
                return next(createError(400, "Incomplete request"));
            }
    
            try {
                const customer = await this.validate.customerId(req.params.customerId);
                const reports = await (this.reportService as ReportService)
                    .getCustomerReportsForDates(
                        customer.id, 
                        invoiceStartDate, 
                        invoiceEndDate
                    );
    
                const reportIds = reports.map((report) => {
                    return report.id;
                });
                
                const tasks = await (this.taskService as TaskService).getAllTasksForGroupOfReports(reportIds);
                const employees = this.getEmployeesWorkedHours(reports, tasks);
                const tableElements = await  this.getTableElements(employees);
    
                res.send(tableElements);
    
                // let invoiceParams: InvoiceParameters = {
                //     invoiceCustomerName: customer.name,
                //     invoiceCustomerAddressLine1: customer.address_line_1
                //     invoiceCustomerAddressLine2: customer.address_line_2
                //     invoiceCustomerAddressLine3: `${customer.city}, ${customer.state} ${customer.zip_code}`,
                //     invoiceNumber: 
                //     invoiceDate: new Date().now();
                //     invoiceDueDate: 
                //     invoiceTerms: 
                //     invoiceDescriptionList: 
                //     invoiceQuantityList: 
                //     invoiceRateList: 
                //     invoiceAmountList: 
                //     invoiceTotal: 
                // }
            } catch (error) {
                return next(createError(500, error));
            }
        }
    
        private async getTableElements(employees: ObjectLiteral) {
            let tableElements = {
                descriptionList: "",
                quantityList: "",
                rateList: "",
                amountList: ""
            } as ObjectLiteral;
    
            for (const key of Object.keys(employees)) {
                const employee = await this.employeeService.get(key);
                const amount = employees[key].totalHours * employee!.customer_rate;
    
                tableElements.descriptionList += `<div>* Software Developer Nearshore</div>`;
                tableElements.quantityList += `<div>${employees[key].totalHours}</div>`;
                tableElements.rateList += `<div>${employee!.customer_rate}</div>`;
                tableElements.amountList += `<div>${amount}</div>`;
            }
    
            return tableElements;
        }
    
        private getEmployeesWorkedHours(reports: any[], tasks: any[]) {
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