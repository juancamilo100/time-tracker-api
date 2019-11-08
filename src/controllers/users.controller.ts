import {
    NextFunction,
    Request,
    RequestHandler,
    Response } from "express";
import IDataService from "../interfaces/dataService.interface";
import User from '../database/entities/user.entity';

class UsersController {
    constructor(private userService: IDataService<User>) {}

    public getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const users = await this.userService.getAll()
        console.log("Returning Users: ");
        
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
