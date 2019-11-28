import express from "express";
import { reportsController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { authorizeEmployeeByReportId } from "../middleware/reportId.authorization.middleware";

const router = express.Router();

router.get("/",
    authorizeAdminEmployee,
    controller.getReports
);
router.get("/:reportId",
    authorizeEmployeeByReportId,
    controller.getReportById
);
router.post("/",
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee],
    controller.createReport
);
router.patch("/:reportId",
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee],
    controller.updateReportById
);
router.delete("/:reportId",
    authorizeAdminEmployee,
    controller.deleteReportById
);

export default router;