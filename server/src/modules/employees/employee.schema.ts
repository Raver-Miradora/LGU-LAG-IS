import { z } from "zod";

const genderEnum = z.enum(["MALE", "FEMALE"]);
const employmentStatusEnum = z.enum([
  "PERMANENT",
  "CASUAL",
  "COTERMINOUS",
  "JOB_ORDER",
  "CONTRACT_OF_SERVICE",
  "TEMPORARY",
  "ELECTED",
]);

export const createEmployeeSchema = z.object({
  body: z.object({
    employeeNo: z.string().min(1, "Employee number is required"),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    suffix: z.string().optional(),
    birthdate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
    gender: genderEnum,
    civilStatus: z.string().min(1, "Civil status is required"),
    address: z.string().min(1, "Address is required"),
    contactNo: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    position: z.string().min(1, "Position is required"),
    department: z.string().min(1, "Department is required"),
    salaryGrade: z.number().int().positive().optional(),
    stepIncrement: z.number().int().positive().optional(),
    employmentStatus: employmentStatusEnum,
    dateHired: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
    bloodType: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
    educationBg: z.any().optional(),
    eligibility: z.any().optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createEmployeeSchema.shape.body.partial(),
});

export const employeeQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("20"),
    search: z.string().optional(),
    department: z.string().optional(),
    status: z.string().optional(),
    isActive: z.string().optional(),
  }),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>["body"];
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>["body"];
