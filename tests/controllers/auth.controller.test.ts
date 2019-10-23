import AuthController from '../../src/controllers/auth.controller'
import userService from '../../src/services/user.service'
import bcrypt from "bcryptjs";

describe("Auth Controller", () => {  
    let authController: AuthController;
    
    beforeAll(() => {
        authController = new AuthController(userService);
    })

    beforeEach(() => {
        jest.resetAllMocks();
    })
    
    describe("Login", () => {
        it("logs in the user", async () => {
            userService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("somepassword")
                };
            });
            
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginUser(req, res, nextFunction);
            expect(res.send).toHaveBeenCalled();
        });

        it("Throws error when user is not found", async () => {
            userService.getByFields = jest.fn().mockImplementation((id: string) => null);
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword"
                }
            };
    
            const res: any = {
                send: jest.fn()
            };

            await authController.loginUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });

        it("Throws error when password is invalid", async () => { 
            userService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("wrongpassword")
                };
            });

            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });
    });

    describe("Login", () => { 
        it("registers the user", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            userService.create = jest.fn();

            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    username: "someuser",
                    password: "somepassword",
                    email: "someemail"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.registerUser(req, res, nextFunction);
            expect(userService.create).toHaveBeenCalled();
        });

        it("throws error when username or password is missing", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            const nextFunction = jest.fn();

            let req: any = {
                body: {
                    password: "somepassword",
                    email: "someemail"
                }
            };

            let res: any = {
                send: jest.fn()
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();

            req = {
                body: {
                    username: "someuser",
                    email: "someemail"
                }
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(userService.create).toHaveBeenCalledTimes(0);
        });

        it("throws error if user already exists", async () => { 
            userService.getByEitherFields = jest.fn().mockImplementation((id: string) => {
                return { 
                    username: "someexistinguser",
                    password: "someexistingpassword",
                    email: "someemail"
                }
            });

            const nextFunction = jest.fn();

            let req: any = {
                body: {
                    username: "someexistinguser",
                    password: "somepassword",
                    email: "someemail"
                }
            };

            let res: any = {
                send: jest.fn()
            };

            await authController.registerUser(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(userService.create).toHaveBeenCalledTimes(0);
        });
    })
});