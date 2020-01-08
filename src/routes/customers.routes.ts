import express from "express";
import { customersController, invoiceController } from "../controllers";
import { authorizeAdminEmployee } from "../middleware/admin.authorization.middleware";
import { transformBodyPropsValuesToLowerCase } from "../middleware/body.transform.lowercase.middleware";
import { authorizeEmployeeByCustomerId } from "../middleware/customerId.authorization.middleware";

const router = express.Router();

router.get("/",
    authorizeAdminEmployee,
    customersController.getCustomers
);
router.get("/:customerId",
    authorizeEmployeeByCustomerId,
    customersController.getCustomerById
);
router.post("/",
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee],
    customersController.createCustomer
);
router.post("/:customerId/invoice",
    authorizeAdminEmployee,
    invoiceController.generateInvoice
);
router.patch("/:customerId",
    [transformBodyPropsValuesToLowerCase, authorizeAdminEmployee],
    customersController.updateCustomerById
);
router.delete("/:customerId",
    authorizeAdminEmployee,
    customersController.deleteCustomerById
);

export default router;
