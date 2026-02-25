import prisma from "../../config/database";
import { CreateServiceRecordInput } from "./service-record.schema";

export class ServiceRecordService {
  async findByEmployee(employeeId: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) {
      throw Object.assign(new Error("Employee not found"), { statusCode: 404 });
    }

    const records = await prisma.serviceRecord.findMany({
      where: { employeeId },
      orderBy: { dateFrom: "asc" },
    });

    return records;
  }

  async create(employeeId: string, data: CreateServiceRecordInput) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) {
      throw Object.assign(new Error("Employee not found"), { statusCode: 404 });
    }

    const record = await prisma.serviceRecord.create({
      data: {
        employeeId,
        dateFrom: new Date(data.dateFrom),
        dateTo: data.dateTo ? new Date(data.dateTo) : null,
        designation: data.designation,
        status: data.status,
        salary: data.salary,
        office: data.office,
        branch: data.branch || null,
        lwop: data.lwop || null,
        separationDate: data.separationDate
          ? new Date(data.separationDate)
          : null,
        separationCause: data.separationCause || null,
        referenceNo: data.referenceNo || null,
        remarks: data.remarks || null,
      },
    });

    return record;
  }

  async update(id: string, data: Partial<CreateServiceRecordInput>) {
    const record = await prisma.serviceRecord.findUnique({ where: { id } });
    if (!record) {
      throw Object.assign(new Error("Service record not found"), {
        statusCode: 404,
      });
    }

    const updateData: any = { ...data };
    if (data.dateFrom) updateData.dateFrom = new Date(data.dateFrom);
    if (data.dateTo) updateData.dateTo = new Date(data.dateTo);
    if (data.separationDate)
      updateData.separationDate = new Date(data.separationDate);

    const updated = await prisma.serviceRecord.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async delete(id: string) {
    const record = await prisma.serviceRecord.findUnique({ where: { id } });
    if (!record) {
      throw Object.assign(new Error("Service record not found"), {
        statusCode: 404,
      });
    }

    await prisma.serviceRecord.delete({ where: { id } });
    return { message: "Service record deleted successfully" };
  }
}

export const serviceRecordService = new ServiceRecordService();
