import AuthController from "./auth.controller";
import EmployeesController from "./employees.controller";
import CustomersController from "./customers.controller";
import ReportsController from './reports.controller';
import TasksController from './tasks.controller';
import InvoiceController from './invoice.controller';

import customerService from "../services/customer.service";
import employeeService from "../services/employee.service";
import reportService from "../services/report.service";
import taskService from "../services/task.service";
import gmailService from "../services/gmail.service";
import invoiceService from "../services/invoice.service";
import hourlyReportService from "../services/hourly.report.service";
import Validator from '../utils/validator';

const validator = new Validator(
    employeeService, 
    taskService,
    reportService, 
    customerService
);

export const authController = new AuthController(employeeService, validator);
export const employeesController = new EmployeesController(employeeService, validator);
export const customersController = new CustomersController(customerService, validator);
export const tasksController = new TasksController(taskService, validator);
export const invoiceController = new InvoiceController(
        reportService,
        employeeService,
        taskService,
        invoiceService,
        hourlyReportService,
        gmailService,
        validator
    );
export const reportsController = new ReportsController(
        reportService,
        taskService,
        validator
    );