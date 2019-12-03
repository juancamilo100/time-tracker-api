import express from "express";
import { authController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authenticateEmployee } from "../middleware/authentication.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { decodeBase64BodyFields } from "../middleware/body.transform.decodeBase64.middleware";

const router = express.Router();

router.post("/login",
    [transformBodyPropsValuesToLowerCase, decodeBase64BodyFields],
    controller.loginEmployee
);
router.post("/register",
    [
        transformBodyPropsValuesToLowerCase, 
        authenticateEmployee, 
        authorizeAdminEmployee, 
        decodeBase64BodyFields
    ],
    controller.registerEmployee
);

export default router;
