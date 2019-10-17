import AuthController from "./auth.controller";
import UsersController from "./users.controller";

import userService from "../services/user.service";

const authController = new AuthController(userService);
const usersController = new UsersController(userService);

export {
    authController,
    usersController,
};
