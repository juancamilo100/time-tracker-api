declare namespace Express {
    interface Request {
        employeeId: number | undefined,
        role: string | undefined
    }
}