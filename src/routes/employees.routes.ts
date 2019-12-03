import express from "express";
import { employeesController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { authorizeEmployeeById } from "../middleware/employeeId.authorization.middleware";
import { reportsController } from "../controllers";
import { decodeBase64BodyFields } from "../middleware/body.transform.decodeBase64.middleware";

const router = express.Router();

router.get("/",
    authorizeAdminEmployee,
    controller.getEmployees
);
router.get("/:employeeId",
    authorizeEmployeeById,
    controller.getEmployeeById
);
router.get("/:employeeId/reports",
    [transformBodyPropsValuesToLowerCase, authorizeEmployeeById],
    reportsController.getReportsByEmployeeId
);
router.patch("/:employeeId",
    [transformBodyPropsValuesToLowerCase, authorizeEmployeeById],
    controller.updateEmployeeById
);
router.patch("/:employeeId/password",
    [
        transformBodyPropsValuesToLowerCase, 
        authorizeEmployeeById,
        decodeBase64BodyFields
    ],
    controller.updateEmployeePasswordById
);
router.delete("/:employeeId",
    authorizeAdminEmployee,
    controller.deleteEmployeeById
);

export default router;
