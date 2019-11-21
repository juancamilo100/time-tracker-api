import express from "express";
import { customersController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { authorizeEmployeeByCustomerId } from "../middleware/customerId.authorization.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";

const router = express.Router();

router.get("/", 
    authorizeAdminEmployee, 
    controller.getCustomers
);
router.get("/:id", 
    authorizeEmployeeByCustomerId, 
    controller.getCustomerById
);
router.patch("/:id", 
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee], 
    controller.updateCustomerById
);
router.delete("/:id", 
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee], 
    controller.deleteCustomerById
);

export default router;
