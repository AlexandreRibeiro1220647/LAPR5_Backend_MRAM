import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import IMedicalConditionController from './IControllers/IMedicalConditionController';

@Service()
export default class MedicalConditionController implements IMedicalConditionController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService
  ) {}

  public async getMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.getMedicalConditions() as Result<IMedicalConditionDTO[]>;

      if (medicalConditionOrError.isFailure) {
        return res.status(404).send();
      }

      const medicalConditionDTOResults = medicalConditionOrError.getValue();
      return res.status(200).json( medicalConditionDTOResults );
    }
    catch (e) {
      return next(e);
    }
  };

  public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
        
      if (medicalConditionOrError.isFailure) {
        return res.status(402).json({ message: medicalConditionOrError.error });
      }

      const medicalConditionDTOResult = medicalConditionOrError.getValue();
      return res.json( medicalConditionDTOResult ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionOrError = await this.medicalConditionServiceInstance.updateMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;

      if (medicalConditionOrError.isFailure) {
        return res.status(404).json({ message: medicalConditionOrError.error });  // Send status 404 for failed update
      }

      const medicalConditionDTOResult = medicalConditionOrError.getValue();
      return res.status(201).json( medicalConditionDTOResult );
    }
    catch (e) {
      return next(e);
    }
  };


  public async searchMedicalConditions(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, designation } = req.query;
  
      const result = await this.medicalConditionServiceInstance.searchMedicalConditions(code as string, designation as string);
  
      if (result.isFailure) {
        return res.status(404).json({ message: "No results found" });
      }
  
      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }
  
}