import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Customer from "../database/entities/customer.entity";
import { toCamelCaseAllProps } from "../utils/formatter";
import IDataService from "../interfaces/dataService.interface";

class CustomersController {
    constructor(private customerService: IDataService<Customer>) {}

    public getCustomers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const customers = await this.customerService.getAll();

        res.send(customers.map((customer) => {
            return this.formatCustomerProps(customer);
        }));
    }

    public getCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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

            res.send(this.formatCustomerProps(customer));
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }
    }

    public deleteCustomerById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            await this.customerService.delete(req.params.id);
            res.send(200);
        } catch (error) {
            console.log(error);
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

    public createCustomer: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body.name || !req.body.email) {
            return next(createError(400, "Incomplete request"));
        }

        try {
            if (await this.customerExists(req.body.name, req.body.email)) {
                return next(createError(409, "Customer already exists"));
            }
        } catch (error) {
            return next(createError(500, "Something went wrong"));
        }

        try {
            const createdCustomer = await this.customerService.create(req.body);
            res.send(this.formatCustomerProps(createdCustomer));
        } catch (error) {
            return next(createError(500, error));
        }
    }

    private customerExists = (name: string, email: string) => {
        return this.customerService.getByEitherFields({ name, email });
    }

    private formatCustomerProps(customer: Customer) {
        const formattedCustomer = toCamelCaseAllProps(customer as ObjectLiteral);

        delete formattedCustomer.createdAt;
        delete formattedCustomer.updatedAt;

        return formattedCustomer;
    }
}

export default CustomersController;
