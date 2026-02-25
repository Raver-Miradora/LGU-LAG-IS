import { Router } from "express";
import { userController } from "./user.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createUserSchema, updateUserSchema } from "./user.schema";

const router = Router();

// All user management routes require SUPER_ADMIN
router.use(authenticate, authorize("SUPER_ADMIN"));

router.get("/", userController.findAll);
router.get("/:id", userController.findById);
router.post("/", validate(createUserSchema), userController.create);
router.put("/:id", validate(updateUserSchema), userController.update);
router.patch("/:id/deactivate", userController.deactivate);
router.post("/:id/reset-password", userController.resetPassword);

export default router;
