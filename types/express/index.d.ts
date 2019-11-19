declare namespace Express {
    export interface Request {
        employeeId: number | undefined,
        role: string | undefined
    }
}