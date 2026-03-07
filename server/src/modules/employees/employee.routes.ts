import { Router } from "express";
import { employeeController } from "./employee.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createEmployeeSchema, updateEmployeeSchema } from "./employee.schema";
import employeeDocumentRouter from "./employee.document";
import employeeIdCardRouter from "./employee.idcard";
import employeePdsRouter from "./employee.pds";
import employeeBatchIdRouter from "./employee.batchid";
import employeeExportRouter from "./employee.export";
import { auditLog } from "../../middleware/auditLog";

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
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "PESO_ADMIN", "PESO_STAFF", "VIEWER"),
  employeeController.getDashboardStats
);

// Export must be mounted before /:id to avoid route conflict
router.use(employeeExportRouter);

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
  auditLog("CREATE", "EMPLOYEE"),
  employeeController.create
);

router.put(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  validate(updateEmployeeSchema),
  auditLog("UPDATE", "EMPLOYEE"),
  employeeController.update
);

// Archive - HR Admin only
router.patch(
  "/:id/archive",
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  auditLog("ARCHIVE", "EMPLOYEE"),
  employeeController.archive
);


router.use(employeeDocumentRouter);
router.use(employeeIdCardRouter);
router.use(employeePdsRouter);
router.use(employeeBatchIdRouter);
export default router;
