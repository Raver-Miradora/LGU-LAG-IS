import serviceRecordPdfRouter from "./service-record.pdf";
import { Router } from "express";
import { serviceRecordController } from "./service-record.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createServiceRecordSchema,
  updateServiceRecordSchema,
} from "./service-record.schema";

const router = Router();

// attach PDF sub-router
router.use(serviceRecordPdfRouter);

router.use(authenticate);

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
  serviceRecordController.create
);

// Update a service record
router.put(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN", "HR_STAFF"),
  validate(updateServiceRecordSchema),
  serviceRecordController.update
);

// Delete a service record
router.delete(
  "/:id",
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  serviceRecordController.delete
);

export default router;
