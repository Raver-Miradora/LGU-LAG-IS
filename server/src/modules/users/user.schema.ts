import { z } from "zod";

const roleEnum = z.enum([
  "SUPER_ADMIN",
  "HR_ADMIN",
  "HR_STAFF",
  "PESO_ADMIN",
  "PESO_STAFF",
  "VIEWER",
]);

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    fullName: z.string().min(1, "Full name is required"),
    role: roleEnum.optional().default("VIEWER"),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    username: z.string().min(3).optional(),
    fullName: z.string().min(1).optional(),
    role: roleEnum.optional(),
    isActive: z.boolean().optional(),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
