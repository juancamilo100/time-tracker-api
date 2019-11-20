// import bcrypt from "bcryptjs";
import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Customer from "../database/entities/customer.entity";
// import IDataService from "../interfaces/dataService.interface";
import { toCamelCase } from "../utils/formatter";
import { CustomerService } from '../services/customer.service';

class CustomersController {
    constructor(private customerService: CustomerService) {}

    public getCustomers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const customers = await this.customerService.getAll();

        res.send(customers.map((customer) => {
            return this.formatCustomersProps(customer);
        }));
    }

    public getCustomersById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            const customer =  await this.customerService.getByFields(
                { id: req.params.id }
            );

            if (!customer) {
                return next(createError(404, "Customers not found"));
            }

            res.send(customer);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteCustomersById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            await this.customerService.delete(req.params.id);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public updateCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            await this.customerService.update(req.params.id, req.body);
            res.send(200);
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    private formatCustomersProps(customer: Customer) {
        const customerToReturn: ObjectLiteral = {};
        const customerLiteral: ObjectLiteral = customer;

        Object.keys(customer).forEach((field) => {
            customerToReturn[toCamelCase(field)] = customerLiteral[field];
        });

        delete customerToReturn.createdAt;
        delete customerToReturn.updatedAt;

        return customerToReturn;
    }
}

export default CustomersController;
