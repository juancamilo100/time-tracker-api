import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import Employee from "../database/entities/employee.entity";
import IDataService from "../interfaces/dataService.interface";
import createError from 'http-errors';

class EmployeesController {
    constructor(private employeeService: IDataService<Employee>) {}

    public getEmployees: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        let employees = await this.employeeService.getAll({ showPassword: true });

        res.send(employees.map((employee) => {
            return this.formatEmployeeProps(employee)
        }));
    }

    public getEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if(!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }
        try {
            const employee =  await this.employeeService.getByFields(
                { id: req.params.id }
            );

            if(!employee) {
                return next(createError(404, "Employee not found"));
            }
            
            res.send(employee);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if(!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            req.body.id = req.params.id;
            await this.employeeService.delete(req.params.id);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public updateEmployeeById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if(!req.params.id || req.params.id === "") {
            return next(createError(400, "Incomplete request"));
        }

        try {
            req.body.id = req.params.id;
            await this.employeeService.update(req.body);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
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
