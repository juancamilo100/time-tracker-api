import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import logger from "morgan";
import swagger from "swagger-ui-express";
import yaml from "yamljs";
import apiRoutes from "./src/api";
import errorHandler from "./src/middleware/errorHandler.middleware";
import notFoundHandler from "./src/middleware/notFoundHandler.middleware";
import path from 'path';
import cors from 'cors'
import { setJavascriptContentType } from './src/middleware/response.contentType.javascript.middleware';

const swaggerDocument = yaml.load("./swagger.yml");
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

app.use("/static/javascript", [
    express.static(path.join(__dirname, 'src/assets/javascript')), 
    setJavascriptContentType
]);
app.use("/static/images", express.static(path.join(__dirname, 'src/assets/images')));
app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocument));
app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
