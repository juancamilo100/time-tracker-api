import AuthController from '../../src/controllers/auth.controller'
import employeeService from '../../src/services/employee.service'
import bcrypt from "bcryptjs";

describe("Auth Controller", () => {  
    let authController: AuthController;
    
    beforeAll(() => {
        authController = new AuthController(employeeService);
    })

    beforeEach(() => {
        jest.resetAllMocks();
    })
    
    describe("Login", () => {
        it("logs in the employee", async () => {
            employeeService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("somepassword")
                };
            });
            
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    email: "someemail@email.com",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginEmployee(req, res, nextFunction);
            expect(res.send).toHaveBeenCalled();
        });

        it("Throws error when employee is not found", async () => {
            employeeService.getByFields = jest.fn().mockImplementation((id: string) => null);
            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    employeename: "someemployee",
                    password: "somepassword"
                }
            };
    
            const res: any = {
                send: jest.fn()
            };

            await authController.loginEmployee(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });

        it("Throws error when password is invalid", async () => { 
            employeeService.getByFields = jest.fn().mockImplementation((id: string) => {
                return {
                    password: bcrypt.hashSync("wrongpassword")
                };
            });

            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    employeename: "someemployee",
                    password: "somepassword"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.loginEmployee(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledTimes(0);
        });
    });

    describe("Registration", () => { 
        it("registers the employee", async () => { 
            employeeService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            employeeService.create = jest.fn();

            const nextFunction = jest.fn();

            const req: any = {
                body: {
                    firstName: "someName",
                    lastName: "someLastName",
                    companyId: "companyId",
                    password: "somepassword",
                    email: "someemail"
                }
            };
    
            let res: any = {
                send: jest.fn()
            };
            
            await authController.registerEmployee(req, res, nextFunction);
            expect(employeeService.create).toHaveBeenCalled();
        });

        it("throws error when email or password is missing", async () => { 
            employeeService.getByEitherFields = jest.fn().mockImplementation((id: string) => null);
            employeeService.create = jest.fn();
            const nextFunction = jest.fn();

            let req: any = {
                body: {
                    email: "someemail"
                }
            };

            let res: any = {
                send: jest.fn()
            };

            await authController.registerEmployee(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();

            req = {
                body: {
                    password: "somepassword",
                }
            };

            await authController.registerEmployee(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(employeeService.create).toHaveBeenCalledTimes(0);
        });

        it("throws error if employee already exists", async () => { 
            employeeService.getByEitherFields = jest.fn().mockImplementation((id: string) => {
                return { 
                    firstName: "exisitingName",
                    lastName: "exisitingLastName",
                    companyId: "companyId",
                    password: "somepassword",
                    email: "someemail"
                }
            });
            employeeService.create = jest.fn();

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

            await authController.registerEmployee(req, res, nextFunction);
            expect(nextFunction).toHaveBeenCalled();
            expect(employeeService.create).toHaveBeenCalledTimes(0);
        });
    })
});