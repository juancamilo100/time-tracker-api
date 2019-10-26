"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
let configPath;
switch (process.env.NODE_ENV) {
    case "test":
        configPath = path_1.default.resolve(process.cwd(), ".env.test");
        break;
    case "production":
        configPath = path_1.default.resolve(process.cwd(), ".env.production");
        break;
    default:
        configPath = path_1.default.resolve(process.cwd(), ".env.development");
}
dotenv_1.default.config({ path: configPath });
exports.SECRET_KEY = process.env.SECRET_KEY || "";
exports.DB_NAME = process.env.DB_NAME || "";
exports.DB_URL = process.env.DB_URL || "";
exports.STOCKS_API_BASE_URL = process.env.STOCKS_API_BASE_URL || "";
exports.STOCKS_API_TOKEN = process.env.STOCKS_API_TOKEN || "";
//# sourceMappingURL=config.js.map