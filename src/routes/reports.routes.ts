import express from "express";
import { reportsController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authorizeEmployeeByReportId } from "../middleware/reportId.authorization.middleware";
import { authorizeBodyEmployeeById } from "../middleware/body.employeeId.authorization.middleware";

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
    authorizeBodyEmployeeById,
    controller.createReport
);
router.patch("/:reportId",
    authorizeBodyEmployeeById,
    controller.updateReportById
);
router.delete("/:reportId",
    authorizeBodyEmployeeById,
    controller.deleteReportById
);

export default router;