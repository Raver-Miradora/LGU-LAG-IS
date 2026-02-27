import { Router } from "express";
import { employeeController } from "./employee.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.schema";
import employeeDocumentRouter from "./employee.document";
import employeeIdCardRouter from "./employee.idcard";

const router = Router();

router.use(authenticate);

// All HR roles + SUPER_ADMIN can read
router.get(
  "/",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  employeeController.findAll
);

router.get(
  "/dashboard",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  employeeController.getDashboardStats
);

router.get(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  employeeController.findById
);

// Create/Edit - HR roles
router.post(
  "/",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  validate(createEmployeeSchema),
  employeeController.create
);

router.put(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  validate(updateEmployeeSchema),
  employeeController.update
);

// Archive - HR Admin only
router.patch(
  "/:id/archive",
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  employeeController.archive
);


router.use(employeeDocumentRouter);
router.use(employeeIdCardRouter);
export default router;
