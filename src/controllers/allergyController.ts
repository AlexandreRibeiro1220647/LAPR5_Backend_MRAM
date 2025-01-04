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
        return res.status(404).json({ message: "Get failed" }); 
      }
  
      const allergyDTOResults = allergiesOrError.getValue();
      return res.status(200).json(allergyDTOResults);
    }
    catch (e) {
      return next(e);
    }
  }
  
  public async createAllergy(req: Request, res: Response, next: NextFunction) {
    try {
      const allergyOrError = await this.allergyServiceInstance.createAllergy(req.body as IAllergyDTO) as Result<IAllergyDTO>;
        
      if (allergyOrError.isFailure) {
        return res.status(404).json({ message: "Creation failed" }); 
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
        return res.status(404).json({ message: "Update failed" });
      }

      const allergyDTOResult = allergyOrError.getValue();
      return res.status(201).json( allergyDTOResult );
    }
    catch (e) {
      return next(e);
    }
  };

  public async searchAllergies(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, designation } = req.query;
  
      const result = await this.allergyServiceInstance.searchAllergies(code as string, designation as string);
  
      if (result.isFailure) {
        return res.status(404).json({ message: "No results found" });
      }
  
      return res.status(200).json(result.getValue());
    } catch (e) {
      return next(e);
    }
  }
  

}