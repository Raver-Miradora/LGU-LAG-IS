import { Request, Response, NextFunction } from "express";
import { serviceRecordService } from "./service-record.service";

export class ServiceRecordController {
  async findByEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await serviceRecordService.findByEmployee(
        req.params.employeeId
      );
      res.json(records);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await serviceRecordService.create(
        req.params.employeeId,
        req.body
      );
      res.status(201).json(record);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await serviceRecordService.update(
        req.params.id,
        req.body
      );
      res.json(record);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceRecordService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const serviceRecordController = new ServiceRecordController();
