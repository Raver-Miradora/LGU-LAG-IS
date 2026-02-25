import { Request, Response, NextFunction } from "express";
import { programService } from "./program.service";

export class ProgramController {
  // ─── SPES ─────────────────────────────────────

  async findAllSpes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.findAllSpes({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as string,
        batchYear: req.query.batchYear ? parseInt(req.query.batchYear as string) : undefined,
      });
      res.json(result);
    } catch (error) { next(error); }
  }

  async createSpes(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await programService.createSpes(req.body);
      res.status(201).json(enrollment);
    } catch (error) { next(error); }
  }

  async updateSpesStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.updateSpesStatus(req.params.id, req.body.status);
      res.json(result);
    } catch (error) { next(error); }
  }

  // ─── OJT ──────────────────────────────────────

  async findAllOjt(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.findAllOjt({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as string,
      });
      res.json(result);
    } catch (error) { next(error); }
  }

  async createOjt(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await programService.createOjt(req.body);
      res.status(201).json(enrollment);
    } catch (error) { next(error); }
  }

  async updateOjtStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.updateOjtStatus(req.params.id, req.body.status);
      res.json(result);
    } catch (error) { next(error); }
  }

  // ─── TUPAD ────────────────────────────────────

  async findAllTupad(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.findAllTupad({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as string,
        batchNo: req.query.batchNo as string,
      });
      res.json(result);
    } catch (error) { next(error); }
  }

  async createTupad(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await programService.createTupad(req.body);
      res.status(201).json(enrollment);
    } catch (error) { next(error); }
  }

  async updateTupadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.updateTupadStatus(req.params.id, req.body.status);
      res.json(result);
    } catch (error) { next(error); }
  }

  // ─── LIVELIHOOD ───────────────────────────────

  async findAllLivelihood(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.findAllLivelihood({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        status: req.query.status as string,
        programType: req.query.programType as string,
      });
      res.json(result);
    } catch (error) { next(error); }
  }

  async createLivelihood(req: Request, res: Response, next: NextFunction) {
    try {
      const enrollment = await programService.createLivelihood(req.body);
      res.status(201).json(enrollment);
    } catch (error) { next(error); }
  }

  async updateLivelihoodStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await programService.updateLivelihoodStatus(req.params.id, req.body.status);
      res.json(result);
    } catch (error) { next(error); }
  }
}

export const programController = new ProgramController();
