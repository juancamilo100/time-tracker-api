#!/usr/bin/env node
import { debug } from "debug";
import http from "http";
import "reflect-metadata";
import app from "../app";
import databaseManager from "../src/database/databaseManager";

const normalizedPort = normalizePort(process.env.PORT || "3000");
app.set("port", normalizedPort);

const server = http.createServer(app);
databaseManager.connect();

server.listen(normalizedPort);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
	return val;
  }

  if (port >= 0) {
	return port;
  }

  return false;
}

function onError(error: any) {
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
	? "pipe " + addr!
	: "port " + addr!.port;
  console.info("Listening on " + bind);

  debug("portafolio:server")("Listening on " + bind);
}
