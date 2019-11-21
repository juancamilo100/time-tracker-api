import express from "express";
import { employeesController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { authorizeEmployeeById } from "../middleware/employeeId.authorization.middleware";

const router = express.Router();

router.get("/",
    authorizeAdminEmployee,
    controller.getEmployees
);
router.get("/:id",
    authorizeEmployeeById,
    controller.getEmployeeById
);
router.patch("/:id",
    [transformBodyPropsValuesToLowerCase, authorizeEmployeeById],
    controller.updateEmployeeById
);
router.patch("/:id/password",
    [transformBodyPropsValuesToLowerCase, authorizeEmployeeById],
    controller.updateEmployeePasswordById
);
router.delete("/:id",
    authorizeAdminEmployee,
    controller.deleteEmployeeById
);

export default router;
