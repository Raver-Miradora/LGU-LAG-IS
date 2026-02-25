import { Router } from "express";
import { beneficiaryController } from "./beneficiary.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createBeneficiarySchema,
  updateBeneficiarySchema,
} from "./beneficiary.schema";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize("SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF", "VIEWER"),
  beneficiaryController.findAll
);

router.get(
  "/dashboard",
  authorize("SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"),
  beneficiaryController.getDashboardStats
);

router.get(
  "/:id",
  authorize("SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF", "VIEWER"),
  beneficiaryController.findById
);

router.post(
  "/",
  authorize("SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"),
  validate(createBeneficiarySchema),
  beneficiaryController.create
);

router.put(
  "/:id",
  authorize("SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"),
  validate(updateBeneficiarySchema),
  beneficiaryController.update
);

export default router;
