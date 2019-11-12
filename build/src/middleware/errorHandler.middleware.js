"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, req, res, next) => {
    res.status(err.status || 500).send({
        message: err.message
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=errorHandler.middleware.js.map