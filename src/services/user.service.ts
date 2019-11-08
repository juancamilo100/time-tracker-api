import IDataService from "../interfaces/dataService.interface";
import { getRepository, Repository, getConnection } from "typeorm";
import User from '../database/entities/user.entity';
// import { createError } from 'http-errors';

class UserService implements IDataService<User> {
    private user = new User();

    public get(id: string) {
        return Promise.resolve(this.user);
    }

    public getByFields(fields: object) {
        return Promise.resolve(this.user);
    }

    public getByEitherFields(fields: object[]) {
        return Promise.resolve(this.user);
    }

    public getAll() {
        console.log("Getting Users: ");
        return getRepository(User).find();
    }

    public getAllByFields(fields: object) {
        return Promise.resolve([this.user]);
    }

    public create(entity: User) {
        const userRepo = getRepository(User);
        const newUser = userRepo.create(entity);
        return userRepo.save(newUser);
    }

    public update(entity: User) {
        return Promise.resolve(this.user);
    }

    public delete(id: string) {
        return Promise.resolve(this.user);
    }
}

export default new UserService();
