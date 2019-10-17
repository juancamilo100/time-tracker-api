import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import createError from "http-errors";
import IDataService from "../interfaces/dataService.interface";
import { IUser } from "../models/user";

class UsersController {
    constructor(private userService: IDataService<IUser>) {}

    public getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send("getting Users: " + this.userService.getAll());
    }

    // TODO: Add authorization to this endpoint.  Only admin user should be able to get any user by id
    public getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send(`getting User by id: ${req.params.id}`);
    }

    // TODO: Add authorization to this endpoint.  Only admin user should be able to perform this action
    public deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send("deleting User");
    }   

    // private hidePassword = (user: IUser) => {
    //     const userWithoutPassword = JSON.parse(JSON.stringify(user));
    //     delete userWithoutPassword.password;
    //     return userWithoutPassword;
    // }
}

export default UsersController;
