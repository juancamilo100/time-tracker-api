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
class AuthController {
    constructor(userService) {
        this.userService = userService;
        this.loginUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send("Logging user in");
            // if (!req.body.username || !req.body.password) {
            //     return next(createError(400, "Incomplete request"));
            // }
            // try {
            //     // get user by username
            //     if (!user) { return next(createError(404, "User not found")); }
            //     const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            //     if (!passwordIsValid) { return next(createError(401, "Unauthorized")); }
            //     const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: 3600 });
            //     res.send({ auth: true, token});
            // } catch (error) {
            //     return next(createError(500, "Something went wrong"));
            // }
        });
        this.registerUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            res.send("Registering user...");
            // if (!req.body.username || !req.body.password) {
            //     return next(createError(400, "Incomplete request"));
            // }
            // try {
            //     if (await this.userExists(req.body.username, req.body.email)) {
            //         return next(createError(409, "User already exists"));
            //     }
            // } catch (error) {
            //     return next(createError(500, "Something went wrong"));
            // }
            // const hashedPassword = bcrypt.hashSync(req.body.password);
            // try {
            //     const newUser = {
            //         username: req.body.username,
            //         password: hashedPassword,
            //         email: req.body.email || ""
            //     } as IUser;
            //     await this.userService.create(newUser);
            //     const token = jwt.sign({id: newUser._id}, SECRET_KEY, { expiresIn: 3600 });
            //     res.send({ auth: true, token});
            // } catch (error) {
            //     return next(createError(500, error));
            // }
        });
        this.userExists = (username, email) => {
            // return this.userService.getByEitherFields([
            //     { email },
            //     { username }
            // ]);
        };
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.controller.js.map