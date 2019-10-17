// import { Types } from "mongoose";
import IDataService from "../interfaces/dataService.interface";
import { IUser } from "../models/user";

class UserService implements IDataService<IUser> {
    public get(id: string) {
        console.log("");
    }

    public getByFields(fields: object) {
        console.log("getByFields");
    }

    public getByEitherFields(fields: object[]) {
        console.log("getByEitherFields");
    }

    public getAll() {
        console.log("getAll");
    }

    public getAllByFields(fields: object) {
        console.log("getAllByFields");
    }

    public create(entity: IUser) {
        console.log("create");
    }

    public update(entity: IUser) {
        console.log("update");
    }

    public delete(id: string) {
        console.log("delete");
    }
}

export default new UserService();
