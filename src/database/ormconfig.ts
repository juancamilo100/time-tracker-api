import { ConnectionOptions } from "typeorm";
import {
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_USER
} from "../../config";

const config: ConnectionOptions = {
  type: "postgres",
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [
    __dirname + "/entities/*.entity{.ts,.js}",
  ],
  synchronize: true,
};

export default config;
