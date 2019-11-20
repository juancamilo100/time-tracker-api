import bcrypt from "bcryptjs";
import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import { ObjectLiteral } from "../../types/generics";
import Customer from "../database/entities/customer.entity";
import IDataService from "../interfaces/dataService.interface";
import { toCamelCase } from "../utils/formatter";

class CustomersController {
    constructor(private customerService: IDataService<Customer>) {}

    // public getCustomers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     const customers = await this.customerService.getAll();

    //     res.send(customers.map((customer) => {
    //         return this.formatCustomersProps(customer);
    //     }));
    // }

    // public getCustomersById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     if (!req.params.id) {
    //         return next(createError(400, "Incomplete request"));
    //     }

    //     try {
    //         const customer =  await this.customerService.getByFields(
    //             { id: req.params.id }
    //         );

    //         if (!customer) {
    //             return next(createError(404, "Customers not found"));
    //         }

    //         res.send(customer);
    //     } catch (error) {
    //         return next(createError(500, "Something went wrong"));
    //     }
    // }

    // public deleteCustomersById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     if (!req.params.id) {
    //         return next(createError(400, "Incomplete request"));
    //     }

    //     try {
    //         await this.customerService.delete(req.params.id);
    //         res.send(200);
    //     } catch (error) {
    //         return next(createError(500, "Something went wrong"));
    //     }
    // }

    // public updateCustomersById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     if (!req.params.id) {
    //         return next(createError(400, "Incomplete request"));
    //     }

    //     if (Object.keys(req.body).includes("password")) {
    //         return next(createError(400, "Cannot change password"));
    //     }

    //     try {
    //         req.body.id = req.params.id;
    //         await this.customerService.update(req.body);
    //         res.send(200);
    //     } catch (error) {
    //         return next(createError(500, "Something went wrong"));
    //     }
    // }

    // public updateCustomersPasswordById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    //     if (!req.params.id ||
    //         !req.body.oldPassword ||
    //         !req.body.newPassword) {
    //         return next(createError(400, "Must provide old and new password"));
    //     }

    //     const customer =  await this.customerService.getByFields(
    //         { id: req.params.id },
    //         { showPassword: true }
    //     );

    //     if (!customer) {
    //         return next(createError(404, "Customer not found"));
    //     }

    //     const oldPasswordIsValid = bcrypt.compareSync(req.body.oldPassword, customer.password);
    //     if (!oldPasswordIsValid) { return next(createError(401, "Unauthorized")); }

    //     try {
    //         const fieldsToUpdate = {
    //             id: req.params.id,
    //             password: bcrypt.hashSync(req.body.newPassword)
    //         };

    //         await this.customerService.update(fieldsToUpdate as any);
    //         res.send(200);
    //     } catch (error) {
    //         return next(createError(500, "Something went wrong"));
    //     }
    // }

    // private formatCustomersProps(customer: Customers) {
    //     const customerToReturn: ObjectLiteral = {};
    //     const customerLiteral: ObjectLiteral = customer;

    //     Object.keys(customer).forEach((field) => {
    //         customerToReturn[toCamelCase(field)] = customerLiteral[field];
    //     });

    //     delete customerToReturn.createdAt;
    //     delete customerToReturn.updatedAt;

    //     return customerToReturn;
    // }
}

export default CustomersController;
