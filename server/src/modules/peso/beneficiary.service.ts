import prisma from "../../config/database";
import { CreateBeneficiaryInput, UpdateBeneficiaryInput } from "./beneficiary.schema";
// @ts-ignore: prisma client types missing
import { Prisma } from "@prisma/client";

export class BeneficiaryService {
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    barangay?: string;
    program?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.BeneficiaryWhereInput = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.barangay) {
      where.barangay = { contains: query.barangay, mode: "insensitive" };
    }

    const [beneficiaries, total] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: "asc" },
        include: {
          _count: {
            select: {
              spesEnrollments: true,
              ojtEnrollments: true,
              tupadEnrollments: true,
              livelihoodEnrollments: true,
            },
          },
        },
      }),
      prisma.beneficiary.count({ where }),
    ]);

    return {
      data: beneficiaries,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      include: {
        spesEnrollments: { orderBy: { createdAt: "desc" } },
        ojtEnrollments: { orderBy: { createdAt: "desc" } },
        tupadEnrollments: { orderBy: { createdAt: "desc" } },
        livelihoodEnrollments: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!beneficiary) {
      throw Object.assign(new Error("Beneficiary not found"), { statusCode: 404 });
    }

    return beneficiary;
  }

  async create(data: CreateBeneficiaryInput) {
    const beneficiary = await prisma.beneficiary.create({
      data: {
        ...data,
        birthdate: new Date(data.birthdate),
        email: data.email || null,
      },
    });

    return beneficiary;
  }

  async update(id: string, data: UpdateBeneficiaryInput) {
    const beneficiary = await prisma.beneficiary.findUnique({ where: { id } });
    if (!beneficiary) {
      throw Object.assign(new Error("Beneficiary not found"), { statusCode: 404 });
    }

    const updateData: any = { ...data };
    if (data.birthdate) updateData.birthdate = new Date(data.birthdate);
    if (data.email === "") updateData.email = null;

    const updated = await prisma.beneficiary.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async getDashboardStats() {
    const [
      totalBeneficiaries,
      activeSpes,
      activeOjt,
      activeTupad,
      activeLivelihood,
      barangayCounts,
    ] = await Promise.all([
      prisma.beneficiary.count(),
      prisma.spesEnrollment.count({ where: { status: "ACTIVE" } }),
      prisma.ojtEnrollment.count({ where: { status: "ACTIVE" } }),
      prisma.tupadEnrollment.count({ where: { status: "ACTIVE" } }),
      prisma.livelihoodEnrollment.count({
        where: { status: { in: ["APPLIED", "APPROVED", "DISBURSED", "MONITORING"] } },
      }),
      prisma.beneficiary.groupBy({
        by: ["barangay"],
        _count: true,
        orderBy: { _count: { barangay: "desc" } },
        take: 10,
      }),
    ]);

    return {
      totalBeneficiaries,
      activePrograms: {
        spes: activeSpes,
        ojt: activeOjt,
        tupad: activeTupad,
        livelihood: activeLivelihood,
      },
      topBarangays: barangayCounts.map((b: any) => ({
        barangay: b.barangay,
        count: b._count,
      })),
    };
  }
}

export const beneficiaryService = new BeneficiaryService();
