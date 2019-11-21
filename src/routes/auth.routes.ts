import express from "express";
import { authController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authenticateEmployee } from "../middleware/authentication.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";

const router = express.Router();

router.post("/login",
    transformBodyPropsValuesToLowerCase,
    controller.loginEmployee
);
router.post("/register",
    [transformBodyPropsValuesToLowerCase, authenticateEmployee, authorizeAdminEmployee],
    controller.registerEmployee
);

export default router;
