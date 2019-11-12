#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const app_1 = __importDefault(require("../app"));
const databaseManager_1 = __importDefault(require("../src/database/databaseManager"));
const normalizedPort = normalizePort(process.env.PORT || "3000");
app_1.default.set("port", normalizedPort);
const server = http_1.default.createServer(app_1.default);
databaseManager_1.default.connect();
server.listen(normalizedPort);
server.on("error", onError);
server.on("listening", onListening);
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof normalizedPort === "string"
        ? "Pipe " + normalizedPort
        : "Port " + normalizedPort;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    console.info("Listening on " + bind);
    debug_1.debug("portafolio:server")("Listening on " + bind);
}
//# sourceMappingURL=www.js.map