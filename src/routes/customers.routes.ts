import express from "express";
import { customersController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";

const router = express.Router();

router.get("/", authorizeAdminEmployee, controller.getCustomers);
router.get("/:id", controller.getCustomersById);
router.patch("/:id", authorizeAdminEmployee, controller.updateCustomerById);
router.delete("/:id", authorizeAdminEmployee, controller.deleteCustomersById);

export default router;
