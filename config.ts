
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

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
export const POSTGRES_PORT = process.env.POSTGRES_PORT;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;