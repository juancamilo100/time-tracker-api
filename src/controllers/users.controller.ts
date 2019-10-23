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

    public getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send(`getting User by id: ${req.params.id}`);
    }

    public deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send("deleting User");
    }   
}

export default UsersController;
