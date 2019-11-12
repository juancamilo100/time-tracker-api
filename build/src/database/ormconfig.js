"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const config = {
    type: "postgres",
    host: config_1.POSTGRES_HOST,
    port: Number(config_1.POSTGRES_PORT),
    username: config_1.POSTGRES_USER,
    password: config_1.POSTGRES_PASSWORD,
    database: config_1.POSTGRES_DB,
    entities: [
        __dirname + "/entities/*.entity{.ts,.js}",
    ],
    synchronize: true,
};
exports.default = config;
//# sourceMappingURL=ormconfig.js.map