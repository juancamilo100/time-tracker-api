import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import User from "../database/entities/user.entity";
import IDataService from "../interfaces/dataService.interface";

class UsersController {
    constructor(private userService: IDataService<User>) {}

    public getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const users = await this.userService.getAll({ showPassword: true });
        res.send(users);
    }

    public getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send(`getting User by id: ${req.params.id}`);
    }

    public deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        res.send("deleting User");
    }
}

export default UsersController;
