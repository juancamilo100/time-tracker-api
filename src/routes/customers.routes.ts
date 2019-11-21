import express from "express";
import { customersController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authorizeEmployeeByCustomerId } from "../middleware/customerId.authorization.middleware";

const router = express.Router();

router.get("/", authorizeAdminEmployee, controller.getCustomers);
router.get("/:id", authorizeEmployeeByCustomerId, controller.getCustomerById);
router.patch("/:id", authorizeAdminEmployee, controller.updateCustomerById);
router.delete("/:id", authorizeAdminEmployee, controller.deleteCustomerById);

export default router;
