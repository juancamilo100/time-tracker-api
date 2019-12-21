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

class CustomersController {
    constructor(
        private customerService: IDataService<Customer>,
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
            await this.validate.customerId(req.params.customerId);
            await this.customerService.update(req.params.customerId, req.body);
            res.send(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public createCustomer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.name || !req.body.email) {
            return next(createError(400, "Incomplete request"));
        }

        try {
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

    private formatCustomerProps(customer: Customer) {
        const formattedCustomer = toCamelCaseAllPropsKeys(customer as ObjectLiteral);

        delete formattedCustomer.createdAt;
        delete formattedCustomer.updatedAt;

        return formattedCustomer;
    }
}

export default CustomersController;
