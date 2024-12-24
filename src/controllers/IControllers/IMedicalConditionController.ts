import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController  {
  createMedicalCondition(req: Request, res: Response, next: NextFunction);
  updateMedicalCondition(req: Request, res: Response, next: NextFunction);
  getMedicalConditions(req: Request, res: Response, next: NextFunction);
}