import { Inject, Service } from 'typedi';
import IMedicalRecordController from './IControllers/IMedicalRecordController';
import config from '../../config';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import { NextFunction, Request, Response } from 'express';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { Result } from '../core/logic/Result';

@Service()
export default class MedicalRecordController implements IMedicalRecordController {

  constructor(
    @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance: IMedicalRecordService,
  ) {}

  public async getMedicalRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordsOrError = await this.medicalRecordServiceInstance.getMedicalRecords();

      if (medicalRecordsOrError.isFailure) {
        return res.status(404).send();
      }

      const medicalRecords = medicalRecordsOrError.getValue();
      return res.json(medicalRecords).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = (await this.medicalRecordServiceInstance.createMedicalRecord(req.body)) as Result<
        IMedicalRecordDTO
      >;

      if (medicalRecordOrError.isFailure) {
        return res.status(402).send();
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.json(medicalRecordDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalRecordOrError = (await this.medicalRecordServiceInstance.updateMedicalRecord(req.body)) as Result<
        IMedicalRecordDTO
      >;

      if (medicalRecordOrError.isFailure) {
        return res.status(404).send();
      }

      const medicalRecordDTO = medicalRecordOrError.getValue();
      return res.status(201).json(medicalRecordDTO);
    } catch (e) {
      return next(e);
    }
  }
}
