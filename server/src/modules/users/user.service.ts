import bcrypt from "bcrypt";
import prisma from "../../config/database";
import { CreateUserInput, UpdateUserInput } from "./user.schema";

export class UserService {
  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          fullName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    return user;
  }

  async create(data: CreateUserInput) {
    const existing = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      throw Object.assign(new Error("Username already exists"), {
        statusCode: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        passwordHash: hashedPassword,
        fullName: data.fullName,
        role: data.role || "VIEWER",
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async update(id: string, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    if (data.username && data.username !== user.username) {
      const existing = await prisma.user.findUnique({
        where: { username: data.username },
      });
      if (existing) {
        throw Object.assign(new Error("Username already taken"), {
          statusCode: 409,
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.fullName && { fullName: data.fullName }),
        ...(data.role && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async deactivate(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: "User deactivated successfully" };
  }

  async resetPassword(id: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });

    return { message: "Password reset successfully" };
  }
}

export const userService = new UserService();
