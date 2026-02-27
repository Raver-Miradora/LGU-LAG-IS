import prisma from "../../config/database";
import { CreateEmployeeInput, UpdateEmployeeInput } from "./employee.schema";
// @ts-ignore: prisma client types missing
import { Prisma } from "@prisma/client";

export class EmployeeService {
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
    isActive?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
        { employeeNo: { contains: query.search, mode: "insensitive" } },
        { position: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.department) {
      where.department = { contains: query.department, mode: "insensitive" };
    }

    if (query.status) {
      where.employmentStatus = query.status as any;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true";
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: "asc" },
        include: {
          _count: { select: { serviceRecords: true, documents: true } },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      data: employees,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        serviceRecords: { orderBy: { dateFrom: "desc" } },
        documents: { orderBy: { uploadedAt: "desc" } },
        idCards: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!employee) {
      throw Object.assign(new Error("Employee not found"), { statusCode: 404 });
    }

    return employee;
  }

  async create(data: CreateEmployeeInput) {
    const existing = await prisma.employee.findUnique({
      where: { employeeNo: data.employeeNo },
    });

    if (existing) {
      throw Object.assign(new Error("Employee number already exists"), {
        statusCode: 409,
      });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        birthdate: new Date(data.birthdate),
        dateHired: new Date(data.dateHired),
        email: data.email || null,
      },
    });

    return employee;
  }

  async update(id: string, data: UpdateEmployeeInput) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw Object.assign(new Error("Employee not found"), { statusCode: 404 });
    }

    const updateData: any = { ...data };
    if (data.birthdate) updateData.birthdate = new Date(data.birthdate);
    if (data.dateHired) updateData.dateHired = new Date(data.dateHired);
    if (data.email === "") updateData.email = null;

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async archive(id: string) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw Object.assign(new Error("Employee not found"), { statusCode: 404 });
    }

    await prisma.employee.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: "Employee archived successfully" };
  }

  async getDashboardStats() {
    const [
      totalEmployees,
      activeEmployees,
      departmentCounts,
      statusCounts,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { isActive: true } }),
      prisma.employee.groupBy({
        by: ["department"],
        _count: true,
        where: { isActive: true },
      }),
      prisma.employee.groupBy({
        by: ["employmentStatus"],
        _count: true,
        where: { isActive: true },
      }),
    ]);

    const totalServiceRecords = await prisma.serviceRecord.count();

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees: totalEmployees - activeEmployees,
      totalServiceRecords,
      byDepartment: departmentCounts.map((d: any) => ({
        department: d.department,
        count: d._count,
      })),
      byStatus: statusCounts.map((s: any) => ({
        status: s.employmentStatus,
        count: s._count,
      })),
    };
  }
}

export const employeeService = new EmployeeService();
