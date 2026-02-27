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
    placeOfBirth: z.string().optional(),
    gender: genderEnum,
    civilStatus: z.string().min(1, "Civil status is required"),
    citizenship: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    bloodType: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    residentialAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    contactNo: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    gsisNo: z.string().optional(),
    sssNo: z.string().optional(),
    pagibigNo: z.string().optional(),
    philhealthNo: z.string().optional(),
    tinNo: z.string().optional(),
    spouseName: z.string().optional(),
    spouseOccupation: z.string().optional(),
    spouseEmployer: z.string().optional(),
    spouseBusinessAddress: z.string().optional(),
    spouseContactNo: z.string().optional(),
    children: z.any().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    position: z.string().min(1, "Position is required"),
    department: z.string().min(1, "Department is required"),
    salaryGrade: z.number().int().positive().optional(),
    stepIncrement: z.number().int().positive().optional(),
    employmentStatus: employmentStatusEnum,
    dateHired: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
    photoUrl: z.string().optional(),
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
