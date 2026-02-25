import { z } from "zod";

const programStatusEnum = z.enum(["ACTIVE", "COMPLETED", "TERMINATED", "GRADUATED", "ON_HOLD"]);
const livelihoodProgramTypeEnum = z.enum([
  "SKILLS_TRAINING", "STARTER_KIT", "SEED_CAPITAL", "CASH_ASSISTANCE", "MICRO_ENTERPRISE",
]);
const livelihoodStatusEnum = z.enum([
  "APPLIED", "APPROVED", "DISBURSED", "MONITORING", "COMPLETED", "TERMINATED",
]);

// ─── SPES ─────────────────────────────────────────

export const createSpesSchema = z.object({
  body: z.object({
    beneficiaryId: z.string().uuid(),
    school: z.string().min(1),
    yearLevel: z.string().min(1),
    assignedAgency: z.string().min(1),
    periodFrom: z.string().refine((d) => !isNaN(Date.parse(d))),
    periodTo: z.string().refine((d) => !isNaN(Date.parse(d))),
    dailyRate: z.number().positive(),
    totalDays: z.number().int().positive(),
    totalCompensation: z.number().positive(),
    govtShare: z.number().optional(),
    employerShare: z.number().optional(),
    batchYear: z.number().int(),
    remarks: z.string().optional(),
  }),
});

// ─── OJT ──────────────────────────────────────────

export const createOjtSchema = z.object({
  body: z.object({
    beneficiaryId: z.string().uuid(),
    school: z.string().min(1),
    course: z.string().min(1),
    hostCompany: z.string().min(1),
    periodFrom: z.string().refine((d) => !isNaN(Date.parse(d))),
    periodTo: z.string().refine((d) => !isNaN(Date.parse(d))),
    requiredHours: z.number().int().positive(),
    renderedHours: z.number().int().optional(),
    supervisorName: z.string().optional(),
    supervisorContact: z.string().optional(),
    evaluationRating: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

// ─── TUPAD ────────────────────────────────────────

export const createTupadSchema = z.object({
  body: z.object({
    beneficiaryId: z.string().uuid(),
    projectName: z.string().min(1),
    workType: z.string().min(1),
    barangay: z.string().min(1),
    periodFrom: z.string().refine((d) => !isNaN(Date.parse(d))),
    periodTo: z.string().refine((d) => !isNaN(Date.parse(d))),
    totalDays: z.number().int().min(1).max(30),
    dailyWage: z.number().positive(),
    totalWage: z.number().positive(),
    skillsCategory: z.string().optional(),
    batchNo: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

// ─── LIVELIHOOD ───────────────────────────────────

export const createLivelihoodSchema = z.object({
  body: z.object({
    beneficiaryId: z.string().uuid(),
    programType: livelihoodProgramTypeEnum,
    assistanceType: z.string().optional(),
    amount: z.number().positive().optional(),
    businessType: z.string().optional(),
    businessName: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: programStatusEnum.or(livelihoodStatusEnum),
  }),
});

export type CreateSpesInput = z.infer<typeof createSpesSchema>["body"];
export type CreateOjtInput = z.infer<typeof createOjtSchema>["body"];
export type CreateTupadInput = z.infer<typeof createTupadSchema>["body"];
export type CreateLivelihoodInput = z.infer<typeof createLivelihoodSchema>["body"];
