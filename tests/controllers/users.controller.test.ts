import UsersController from '../../src/controllers/users.controller'
import userService from '../../src/services/user.service'
import { testUsers, testUsersWithoutPassword } from '../utils/mockData'

describe("Users Controller", () => {  
    let usersController: UsersController;
    let res: any;
    let nextFunction: any;
    
    beforeAll(() => {
        usersController = new UsersController(userService);
        res = {
            send: jest.fn()
        };
        nextFunction = jest.fn();
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });
    
    describe("Get User", () => {
        it("gets all users and hides their passwords", async () => { 
            userService.getAll = jest.fn().mockImplementation(() => {
                return Promise.resolve(testUsers);
            });

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword"
                }
            };
            
            await usersController.getUsers(req, res, nextFunction);
            expect(res.send).toHaveBeenCalledWith(testUsersWithoutPassword);
        });

        it("gets user by id and hides password", async () => {  
            const req: any = {
                userId: '1234',
                params: {
                    id: '1234'
                }
            };

            userService.get = jest.fn().mockImplementation((id: string) => {
                return Promise.resolve(testUsers[0]);
            });

            await usersController.getUserById(req, res, nextFunction);
            expect(res.send).toHaveBeenCalledWith(testUsersWithoutPassword[0]);
        });

        it("doesn't allow non admin users to fetch other user's data", async () => { 
            const req: any = {
                userId: '7890',
                params: {
                    id: '1234'
                }
            };

            await usersController.getUserById(req, res, nextFunction);

            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });

        it("deletes a user and returns deleted user with password hidden", async () => { 
            const req: any = {
                userId: '1234',
                params: {
                    id: '1234'
                }
            };

            userService.delete = jest.fn().mockImplementation((id: string) => {
                return Promise.resolve(testUsers[0]);
            });

            await usersController.deleteUser(req, res, nextFunction);
            expect(res.send).toHaveBeenCalledWith(testUsersWithoutPassword[0]);
        });
    });
});