import AuthController from "./auth.controller";
import EmployeesController from "./employees.controller";

import employeeService from "../services/employee.service";
import CustomersController from './customers.controller';
import customerService from "../services/customer.service";

export const authController = new AuthController(employeeService);
export const employeesController = new EmployeesController(employeeService);
export const customersController = new CustomersController(customerService);

