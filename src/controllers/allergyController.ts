import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IAllergyController from "./IControllers/IAllergyController";
import IAllergyService from '../services/IServices/IAllergyService';
import { IAllergyDTO } from '../dto/IAllergyDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class AllergyController implements IAllergyController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.allergy.name) private allergyServiceInstance : IAllergyService
  ) {}

  public async getAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const allergiesOrError = await this.allergyServiceInstance.getAllergies() as Result<IAllergyDTO[]>;

      if (allergiesOrError.isFailure) {
        return res.status(404).send();
      }

      const allergyDTOResults = allergiesOrError.getValue();
      return res.status(200).json( allergyDTOResults );
    }
    catch (e) {
      return next(e);
    }
  };

  public async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;
        
      if (allergyOrError.isFailure) {
        return res.status(402).send();
      }

      const allergyDTOResult = allergyOrError.getValue();
      return res.json( allergyDTOResult ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.updateAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;

      if (allergyOrError.isFailure) {
        return res.status(404).send();
      }

      const allergyDTOResult = allergyOrError.getValue();
      return res.status(201).json( allergyDTOResult );
    }
    catch (e) {
      return next(e);
    }
  };
}