import AuthController from "./auth.controller";
import EmployeesController from "./employees.controller";

import employeeService from "../services/employee.service";

const authController = new AuthController(employeeService);
const employeesController = new EmployeesController(employeeService);

export {
    authController,
    employeesController,
};
