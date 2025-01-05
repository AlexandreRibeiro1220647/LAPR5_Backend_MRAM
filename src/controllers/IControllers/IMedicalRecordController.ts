import { NextFunction, Request, Response } from 'express';

export default interface IMedicalRecordController {
  createMedicalRecord(req: Request, res: Response, next: NextFunction);
  updateMedicalRecord(req: Request, res: Response, next: NextFunction);
  getMedicalRecords(req: Request, res: Response, next: NextFunction);
}
