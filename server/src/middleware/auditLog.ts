import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

export const auditLog = (action: string, entityType: string) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    // Store audit info to be used after the response is sent
    const originalJson = _res.json.bind(_res);

    _res.json = function (body: any) {
      // Log the audit entry asynchronously after response
      if (req.user) {
        prisma.auditLog
          .create({
            data: {
              userId: req.user.userId,
              action,
              entityType,
              entityId: req.params.id || body?.id || null,
              newValues: req.body || null,
              ipAddress:
                (req.headers["x-forwarded-for"] as string) ||
                req.socket.remoteAddress ||
                null,
            },
          })
          .catch((err) => {
            console.error("Audit log error:", err);
          });
      }
      return originalJson(body);
    };

    next();
  };
};
