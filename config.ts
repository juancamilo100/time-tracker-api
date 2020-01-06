
import dotenv from "dotenv";
import path from "path";

let configPath;

switch (process.env.NODE_ENV) {
  case "test":
    configPath = path.resolve(process.cwd(), ".env.test");
    break;
  default:
    configPath = path.resolve(process.cwd(), ".env.development");
}

dotenv.config({ path: configPath });

export const PORT = process.env.PORT;
export const APP_NAME = process.env.APP_NAME;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const PGADMIN_DEFAULT_EMAIL = process.env.PGADMIN_DEFAULT_EMAIL;
export const PGADMIN_DEFAULT_PASSWORD = process.env.PGADMIN_DEFAULT_PASSWORD;
export const DEFAULT_ADMIN_EMPLOYEE_EMAIL = process.env.DEFAULT_ADMIN_EMPLOYEE_EMAIL;
export const DEFAULT_ADMIN_EMPLOYEE_PASSWORD = process.env.DEFAULT_ADMIN_EMPLOYEE_PASSWORD;
export const INVOICE_EMAIL_SENDER_ADDRESS = process.env.INVOICE_EMAIL_SENDER_ADDRESS;
export const INVOICE_EMAIL_SENDER_PASSWORD = process.env.INVOICE_EMAIL_SENDER_PASSWORD;
