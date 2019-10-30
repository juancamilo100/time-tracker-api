import dotenv from "dotenv";
// import path from "path";

let configPath;

// export const NODE_ENV) 
//   case "test":
//     export const ), ".env.test")
//     break;
//   case "production":
//     export const ), ".env.production")
//     break;
//   default:
//     export const ), ".env.development")
// }

dotenv.config({ path: configPath });

export const POSTGRES_PORT = process.env.POSTGRES_PORT
export const POSTGRES_HOST = process.env.POSTGRES_HOST
export const POSTGRES_USER = process.env.POSTGRES_USER
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
export const POSTGRES_DB = process.env.POSTGRES_DB
