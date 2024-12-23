import { Request, Response, NextFunction } from 'express';

export default interface IAllergyController  {
  createAllergy(req: Request, res: Response, next: NextFunction);
  updateAllergy(req: Request, res: Response, next: NextFunction);
  getAllergies(req: Request, res: Response, next: NextFunction);
}