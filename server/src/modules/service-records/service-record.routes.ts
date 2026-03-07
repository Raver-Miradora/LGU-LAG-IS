import serviceRecordPdfRouter from "./service-record.pdf";
import { Router } from "express";
import { serviceRecordController } from "./service-record.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createServiceRecordSchema,
  updateServiceRecordSchema,
} from "./service-record.schema";
import { auditLog } from "../../middleware/auditLog";

const router = Router();

// attach PDF sub-router
router.use(serviceRecordPdfRouter);

router.use(authenticate);

// Global paginated listing of all service records
router.get(
  "/",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  serviceRecordController.findAll
);

// Get service records for an employee
router.get(
  "/employee/:employeeId",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF", "VIEWER"),
  serviceRecordController.findByEmployee
);

// Create a new service record
router.post(
  "/employee/:employeeId",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  validate(createServiceRecordSchema),
  auditLog("CREATE", "SERVICE_RECORD"),
  serviceRecordController.create
);

// Update a service record
router.put(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  validate(updateServiceRecordSchema),
  auditLog("UPDATE", "SERVICE_RECORD"),
  serviceRecordController.update
);

// Delete a service record
router.delete(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  auditLog("DELETE", "SERVICE_RECORD"),
  serviceRecordController.delete
);

export default router;
