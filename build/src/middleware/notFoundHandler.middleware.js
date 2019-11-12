"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const notFoundHandler = (req, res, next) => {
    console.log("Not Found!!");
    next(http_errors_1.default(404));
};
exports.default = notFoundHandler;
//# sourceMappingURL=notFoundHandler.middleware.js.map