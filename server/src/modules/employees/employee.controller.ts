import { Request, Response, NextFunction } from "express";
import { employeeService } from "./employee.service";
import { beneficiaryService } from "../peso/beneficiary.service";

export class EmployeeController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeService.findAll({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string,
        department: req.query.department as string,
        status: req.query.status as string,
        isActive: req.query.isActive as string,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.findById(req.params.id as string);
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const employee = await employeeService.update(req.params.id as string, req.body);
      res.json(employee);
    } catch (error) {
      next(error);
    }
  }

  async archive(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await employeeService.archive(req.params.id as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const hrStats = await employeeService.getDashboardStats();
      // enrich with peso stats if available
      const pesoStats = await beneficiaryService.getDashboardStats();
      // sum active programs across all types for a simple metric
      const totalActivePrograms = Object.values(pesoStats.activePrograms).reduce(
        (sum: number, n: number) => sum + n,
        0
      );
      const combined = {
        ...hrStats,
        totalBeneficiaries: pesoStats.totalBeneficiaries,
        activePrograms: totalActivePrograms,
        // also include breakdown if the client wants it later
        activeProgramsByType: pesoStats.activePrograms,
      };
      res.json(combined);
    } catch (error) {
      next(error);
    }
  }
}

export const employeeController = new EmployeeController();
