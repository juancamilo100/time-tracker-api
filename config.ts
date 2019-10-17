import dotenv from "dotenv";
import path from "path";

let configPath;

switch (process.env.NODE_ENV) {
  case "test":
    configPath = path.resolve(process.cwd(), ".env.test");
    break;
  case "production":
    configPath = path.resolve(process.cwd(), ".env.production");
    break;
  default:
    configPath = path.resolve(process.cwd(), ".env.development");
}

dotenv.config({ path: configPath });

export const SECRET_KEY = process.env.SECRET_KEY || "";
export const DB_NAME = process.env.DB_NAME || "";
export const DB_URL = process.env.DB_URL || "";
export const STOCKS_API_BASE_URL = process.env.STOCKS_API_BASE_URL || "";
export const STOCKS_API_TOKEN = process.env.STOCKS_API_TOKEN || "";

