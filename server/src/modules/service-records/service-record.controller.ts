import { Request, Response, NextFunction } from "express";
import { serviceRecordService } from "./service-record.service";

export class ServiceRecordController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceRecordService.findAll({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findByEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await serviceRecordService.findByEmployee(
        (Array.isArray(req.params.employeeId) ? req.params.employeeId[0] : req.params.employeeId) as string
      );
      res.json(records);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await serviceRecordService.create(
        (Array.isArray(req.params.employeeId) ? req.params.employeeId[0] : req.params.employeeId) as string,
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
        (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string,
        req.body
      );
      res.json(record);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await serviceRecordService.delete((Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const serviceRecordController = new ServiceRecordController();
