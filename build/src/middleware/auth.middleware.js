"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import createError from "http-errors";
// import jwt from "jsonwebtoken";
// import { SECRET_KEY } from "../../config";
// interface IDecodedToken {
// 	userId: string;
// }
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Authenticating user....");
    next();
    // const token = req.header("authorization");
    // if (!token) {
    // 	return next(createError(401, "Unauthorized"));
    // }
    // try {
    // 	const decodedToken = jwt.verify(token, SECRET_KEY) as IDecodedToken;
    // 	req.userId = decodedToken.userId;
    // 	next();
    // } catch (error) {
    // 	return next(createError(401, "Unauthorized"));
    // }
});
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=auth.middleware.js.map