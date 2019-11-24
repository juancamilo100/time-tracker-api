import express from "express";
import { customersController as controller } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { authorizeEmployeeByCustomerId } from "../middleware/customerId.authorization.middleware";

const router = express.Router();

router.get("/",
    authorizeAdminEmployee,
    controller.getCustomers
);
router.get("/:id",
    authorizeEmployeeByCustomerId,
    controller.getCustomerById
);
router.post("/",
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee],
    controller.createCustomer
);
router.patch("/:id",
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee],
    controller.updateCustomerById
);
router.delete("/:id",
    authorizeAdminEmployee,
    controller.deleteCustomerById
);

export default router;
