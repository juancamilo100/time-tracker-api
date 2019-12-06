import AuthController from "./auth.controller";
import EmployeesController from "./employees.controller";
import CustomersController from "./customers.controller";
import ReportsController from './reports.controller';

import customerService from "../services/customer.service";
import employeeService from "../services/employee.service";
import reportService from "../services/report.service";
import taskService from "../services/task.service";
import { Validator } from '../utils/validator';
import TasksController from './tasks.controller';

const validator = new Validator(employeeService, taskService, reportService);

export const authController = new AuthController(employeeService);
export const employeesController = new EmployeesController(employeeService);
export const customersController = new CustomersController(customerService);
export const reportsController = new ReportsController(
        reportService, 
        taskService,
        validator
    );
export const tasksController = new TasksController(taskService, validator);