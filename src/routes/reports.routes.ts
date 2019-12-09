import express from "express";
import { reportsController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authorizeEmployeeByReportId } from "../middleware/reportId.authorization.middleware";
import { authorizeBodyEmployeeById } from "../middleware/body.employeeId.authorization.middleware";
import tasksRouter from "../routes/tasks.routes";

const router = express.Router({ mergeParams: true });

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
router.post("/:reportId/submit",
    authorizeEmployeeByReportId,
    controller.submitReport
);
router.patch("/:reportId",
    authorizeBodyEmployeeById,
    controller.updateReportById
);
router.delete("/:reportId",
    authorizeBodyEmployeeById,
    controller.deleteReportById
);
router.use("/:reportId/tasks", tasksRouter);

export default router;