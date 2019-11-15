declare namespace Express {
    export interface Request {
        employeeId: string | undefined,
        role: string | undefined
    }
}