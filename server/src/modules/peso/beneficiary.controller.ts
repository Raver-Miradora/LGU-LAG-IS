import { Request, Response, NextFunction } from "express";
import { beneficiaryService } from "./beneficiary.service";

export class BeneficiaryController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await beneficiaryService.findAll({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
        barangay: req.query.barangay as string,
        program: req.query.program as string,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const beneficiary = await beneficiaryService.findById((Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string);
      res.json(beneficiary);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const beneficiary = await beneficiaryService.create(req.body);
      res.status(201).json(beneficiary);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const beneficiary = await beneficiaryService.update((Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string, req.body);
      res.json(beneficiary);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await beneficiaryService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const beneficiaryController = new BeneficiaryController();
