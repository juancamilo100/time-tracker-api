import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import swagger from "swagger-ui-express";
import yaml from "yamljs";
import apiRoutes from "./src/api";
import errorHandler from "./src/middleware/errorHandler.middleware";
import notFoundHandler from "./src/middleware/notFoundHandler.middleware";

const swaggerDocument = yaml.load("./swagger.yml");
const app = express();

console.log("-----------------------------");
console.log("ENV vars:");
console.log(process.env.ENCRYPTION_KEY);
console.log(process.env.POSTGRES_PORT);
console.log(process.env.POSTGRES_HOST);
console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_PASSWORD);
console.log(process.env.POSTGRES_DB);
console.log("-----------------------------");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
