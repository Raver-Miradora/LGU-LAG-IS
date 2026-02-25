import { z } from "zod";

export const createServiceRecordSchema = z.object({
  params: z.object({ employeeId: z.string().uuid() }),
  body: z.object({
    dateFrom: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
    dateTo: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date").optional(),
    designation: z.string().min(1, "Designation is required"),
    status: z.string().min(1, "Status is required"),
    salary: z.number().positive("Salary must be positive"),
    office: z.string().min(1, "Office is required"),
    branch: z.string().optional(),
    lwop: z.string().optional(),
    separationDate: z.string().optional(),
    separationCause: z.string().optional(),
    referenceNo: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

export const updateServiceRecordSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createServiceRecordSchema.shape.body.partial(),
});

export type CreateServiceRecordInput = z.infer<typeof createServiceRecordSchema>["body"];
