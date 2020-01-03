import { ObjectLiteral } from '../generics';

declare namespace Express {
    export interface Request {
        employeeId: number | undefined,
        role: string | undefined
    }
}

interface Window {
    env: ObjectLiteral
}