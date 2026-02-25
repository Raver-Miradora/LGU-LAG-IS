import prisma from "../../config/database";
import {
  CreateSpesInput,
  CreateOjtInput,
  CreateTupadInput,
  CreateLivelihoodInput,
} from "./program.schema";

export class ProgramService {
  // ─── SPES ─────────────────────────────────────

  async findAllSpes(query: { page?: number; limit?: number; status?: string; batchYear?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.batchYear) where.batchYear = query.batchYear;

    const [data, total] = await Promise.all([
      prisma.spesEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { beneficiary: true },
      }),
      prisma.spesEnrollment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createSpes(data: CreateSpesInput) {
    return prisma.spesEnrollment.create({
      data: {
        ...data,
        periodFrom: new Date(data.periodFrom),
        periodTo: new Date(data.periodTo),
      },
      include: { beneficiary: true },
    });
  }

  async updateSpesStatus(id: string, status: string) {
    return prisma.spesEnrollment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // ─── OJT ──────────────────────────────────────

  async findAllOjt(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.status) where.status = query.status;

    const [data, total] = await Promise.all([
      prisma.ojtEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { beneficiary: true },
      }),
      prisma.ojtEnrollment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createOjt(data: CreateOjtInput) {
    return prisma.ojtEnrollment.create({
      data: {
        ...data,
        periodFrom: new Date(data.periodFrom),
        periodTo: new Date(data.periodTo),
      },
      include: { beneficiary: true },
    });
  }

  async updateOjtStatus(id: string, status: string) {
    return prisma.ojtEnrollment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // ─── TUPAD ────────────────────────────────────

  async findAllTupad(query: { page?: number; limit?: number; status?: string; batchNo?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.batchNo) where.batchNo = query.batchNo;

    const [data, total] = await Promise.all([
      prisma.tupadEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { beneficiary: true },
      }),
      prisma.tupadEnrollment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createTupad(data: CreateTupadInput) {
    return prisma.tupadEnrollment.create({
      data: {
        ...data,
        periodFrom: new Date(data.periodFrom),
        periodTo: new Date(data.periodTo),
      },
      include: { beneficiary: true },
    });
  }

  async updateTupadStatus(id: string, status: string) {
    return prisma.tupadEnrollment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // ─── LIVELIHOOD ───────────────────────────────

  async findAllLivelihood(query: { page?: number; limit?: number; status?: string; programType?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.programType) where.programType = query.programType;

    const [data, total] = await Promise.all([
      prisma.livelihoodEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { beneficiary: true },
      }),
      prisma.livelihoodEnrollment.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createLivelihood(data: CreateLivelihoodInput) {
    return prisma.livelihoodEnrollment.create({
      data: {
        ...data,
      },
      include: { beneficiary: true },
    });
  }

  async updateLivelihoodStatus(id: string, status: string) {
    return prisma.livelihoodEnrollment.update({
      where: { id },
      data: { status: status as any },
    });
  }
}

export const programService = new ProgramService();
