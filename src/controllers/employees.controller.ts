import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import Employee from "../database/entities/employee.entity";
import IDataService from "../interfaces/dataService.interface";

class EmployeesController {
    constructor(private employeeService: IDataService<Employee>) {}

    public getEmployees: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let employees = await this.employeeService.getAll({ showPassword: true });
        console.log("Role of this employee:");
        console.log(req.role);

        res.send(employees.map((employee) => {
            return this.formatEmployeeProps(employee)
        }));
    }

    public getEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send(`getting Employee by id: ${req.params.id}`);
    }

    public deleteEmployee: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send("deleting Employee");
    }

    private formatEmployeeProps(employee: Employee) {
        return {
            id: employee.id,
            firstName: employee.first_name,
            lastName: employee.last_name,
            email: employee.email,
            password: employee.password,
            customerId: employee.customer_id,
            hourlyRate: employee.hourly_rate,
            role: employee.role
        }
    }
}

export default EmployeesController;
