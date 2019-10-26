"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const api_1 = __importDefault(require("./src/api"));
const errorHandler_middleware_1 = __importDefault(require("./src/middleware/errorHandler.middleware"));
const notFoundHandler_middleware_1 = __importDefault(require("./src/middleware/notFoundHandler.middleware"));
const swaggerDocument = yamljs_1.default.load("./swagger.yml");
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(compression_1.default());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use("/api", api_1.default);
app.use(notFoundHandler_middleware_1.default);
app.use(errorHandler_middleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map