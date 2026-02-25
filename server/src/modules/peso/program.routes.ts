import { Router } from "express";
import { programController } from "./program.controller";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createSpesSchema,
  createOjtSchema,
  createTupadSchema,
  createLivelihoodSchema,
  updateStatusSchema,
} from "./program.schema";

const router = Router();

router.use(authenticate);

const pesoRoles = ["SUPER_ADMIN", "PESO_ADMIN", "PESO_STAFF"];
const pesoReadRoles = [...pesoRoles, "VIEWER"];

// ─── SPES ─────────────────────────────────────────

router.get("/spes", authorize(...pesoReadRoles), programController.findAllSpes);
router.post("/spes", authorize(...pesoRoles), validate(createSpesSchema), programController.createSpes);
router.patch("/spes/:id/status", authorize(...pesoRoles), validate(updateStatusSchema), programController.updateSpesStatus);

// ─── OJT ──────────────────────────────────────────

router.get("/ojt", authorize(...pesoReadRoles), programController.findAllOjt);
router.post("/ojt", authorize(...pesoRoles), validate(createOjtSchema), programController.createOjt);
router.patch("/ojt/:id/status", authorize(...pesoRoles), validate(updateStatusSchema), programController.updateOjtStatus);

// ─── TUPAD ────────────────────────────────────────

router.get("/tupad", authorize(...pesoReadRoles), programController.findAllTupad);
router.post("/tupad", authorize(...pesoRoles), validate(createTupadSchema), programController.createTupad);
router.patch("/tupad/:id/status", authorize(...pesoRoles), validate(updateStatusSchema), programController.updateTupadStatus);

// ─── LIVELIHOOD ───────────────────────────────────

router.get("/livelihood", authorize(...pesoReadRoles), programController.findAllLivelihood);
router.post("/livelihood", authorize(...pesoRoles), validate(createLivelihoodSchema), programController.createLivelihood);
router.patch("/livelihood/:id/status", authorize(...pesoRoles), validate(updateStatusSchema), programController.updateLivelihoodStatus);

export default router;
