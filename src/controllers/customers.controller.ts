import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Customer from "../database/entities/customer.entity";
import { toCamelCaseAllPropsKeys } from "../utils/formatter";
import IDataService from "../interfaces/dataService.interface";
import { Validator } from '../utils/validator';
import { InvoiceService, InvoiceParameters } from '../services/invoice.service';
import Report from '../database/entities/report.entity';
import Employee from "../database/entities/employee.entity";
import Task from '../database/entities/task.entity';
import moment from 'moment';
import { ReportPeriod } from '../../types/types';
import { ReportService } from '../services/report.service';
import { TaskService } from '../services/task.service';

class CustomersController {
    constructor(
        private customerService: IDataService<Customer>,
        private reportService: IDataService<Report>,
        private employeeService: IDataService<Employee>,
        private taskService: IDataService<Task>,
        private invoiceService: InvoiceService,
        private validate: Validator) {}

    public getCustomers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const customers = await this.customerService.getAll();

        res.send(customers.map((customer) => {
            return this.formatCustomerProps(customer);
        }));
    }

    public getCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customer = await this.validate.customerId(req.params.customerId);
            res.send(this.formatCustomerProps(customer));
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public deleteCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.validate.customerId(req.params.customerId);
            await this.customerService.delete(req.params.customerId);
            res.send(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public updateCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(req.body.email) {
                this.validate.isEmail(req.body.email);
            }
            await this.validate.customerId(req.params.customerId);
            await this.customerService.update(req.params.customerId, req.body);
            res.send(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public createCustomer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (
            !req.body.name || 
            !req.body.email ||
            !req.body.addressLine1 || 
            !req.body.addressLine2 || 
            !req.body.city || 
            !req.body.state || 
            !req.body.zipCode) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            this.validate.isEmail(req.body.email);
            await this.validate.customerExists(req.body.name, req.body.email);
        } catch (error) {
            return next(createError(400, error));
        }

        try {
            const createdCustomer = await this.customerService.create(req.body);
            res.send(this.formatCustomerProps(createdCustomer));
        } catch (error) {
            return next(createError(500, error));
        }
    }

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

    private async getInvoiceTotal(reports: Report[]) {
        let total = 0;
        // let tasks = await this.taskService.get
        // for (let i = 0; i < reports.length; i++) {
        //     let tasks = await this.taskService.getAllByFields({report_id: reports[i].id});
        //     for (let j = 0; j < tasks.length; j++) {
        //         const element = array[j];
                
        //     }
        // }
    }

    // private async getReportPeriod(reportId: string) {
    //     const report = await this.reportService.get(reportId);
    //     let period: ReportPeriod = {
    //         start: report!.start_date,
    //         end: report!.end_date
    //     };

    //     return period;
    // }

    private formatCustomerProps(customer: Customer) {
        const formattedCustomer = toCamelCaseAllPropsKeys(customer as ObjectLiteral);

        delete formattedCustomer.createdAt;
        delete formattedCustomer.updatedAt;

        return formattedCustomer;
    }
}

export default CustomersController;
