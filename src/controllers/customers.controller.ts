import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Customer from "../database/entities/customer.entity";
import { toCamelCaseAllPropsKeys, toTitleCase } from "../utils/formatter";
import IDataService from "../interfaces/data.service.interface";
import Validator from '../utils/validator';

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
            res.sendStatus(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public updateCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const customerToUpdate = req.body;
        
        try {
            if(customerToUpdate.emails) {
                customerToUpdate.emails.forEach((email: string) => {
                    this.validate.isEmail(email);
                });
            }
            await this.validate.customerId(req.params.customerId);
            await this.customerService.update(req.params.customerId, customerToUpdate);
            res.sendStatus(200);
        } catch (error) {
            return next(createError(500, error));
        }
    }

    public createCustomer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (
            !req.body.name || 
            !req.body.emails ||
            !req.body.emails.length ||
            !req.body.addressLine1 || 
            !req.body.city || 
            !req.body.state || 
            !req.body.zipCode) {
            return next(createError(400, "Incomplete request"));
        }

        const customerToCreate = req.body;

        try {
            customerToCreate.emails.forEach((email: string) => {
                this.validate.isEmail(email);
            });
            await this.validate.customerExists(customerToCreate.name, customerToCreate.emails);
        } catch (error) {
            return next(createError(400, error));
        }

        try {
            const createdCustomer = await this.customerService.create(customerToCreate);
            res.send(this.formatCustomerProps(createdCustomer));
        } catch (error) {
            return next(createError(500, error));
        }
    }

    private formatCustomerProps(customer: Customer) {
        customer.name = toTitleCase(customer.name);
        customer.address_line_1 = toTitleCase(customer.address_line_1);
        customer.address_line_2 = toTitleCase(customer.address_line_2);
        customer.city = toTitleCase(customer.city);
        customer.state = toTitleCase(customer.state);
        
        const formattedCustomer = toCamelCaseAllPropsKeys(customer as ObjectLiteral);
        
        delete formattedCustomer.createdAt;
        delete formattedCustomer.updatedAt;
        
        return formattedCustomer;
    }
}

export default CustomersController;
