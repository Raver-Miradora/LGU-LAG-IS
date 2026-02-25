import { z } from "zod";

const genderEnum = z.enum(["MALE", "FEMALE"]);

export const createBeneficiarySchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    suffix: z.string().optional(),
    birthdate: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
    gender: genderEnum,
    civilStatus: z.string().min(1, "Civil status is required"),
    address: z.string().min(1, "Address is required"),
    barangay: z.string().min(1, "Barangay is required"),
    contactNo: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    educationLevel: z.string().optional(),
    school: z.string().optional(),
    course: z.string().optional(),
    skills: z.array(z.string()).optional().default([]),
  }),
});

export const updateBeneficiarySchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createBeneficiarySchema.shape.body.partial(),
});

export type CreateBeneficiaryInput = z.infer<typeof createBeneficiarySchema>["body"];
export type UpdateBeneficiaryInput = z.infer<typeof updateBeneficiarySchema>["body"];
