import { Service, Inject } from 'typedi';
import config from "../../config";
import { Result } from "../core/logic/Result";
import IMedicalConditionService from './IServices/IMedicalConditionService';
import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import { IMedicalConditionDTO } from '../dto/IMedicalConditionDTO';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import { MedicalCondition } from '../domain/MedicalCondition/medicalCondition';

@Service()
export default class MedicalConditionService implements IMedicalConditionService {
  constructor(
      @Inject(config.repos.medicalCondition.name) private medicalConditionRepo : IMedicalConditionRepo
  ) {}

  public async getMedicalConditionById( medicalConditionId: string): Promise<Result<IMedicalConditionDTO>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByDomainId(medicalConditionId);

      if (medicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("Medical Condition not found");
      }
      else {
        const medicalConditionDTOResult = MedicalConditionMap.toDTO( medicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>> {
    try {
      const medicalConditions = await this.medicalConditionRepo.findAll();

      if (medicalConditions === null) {
        return Result.fail<IMedicalConditionDTO[]>("Medical Condition not found");
      }
      else {
        const medicalConditionDTOResults = await Promise.all(
          medicalConditions.map(medicalConditionRecord => MedicalConditionMap.toDTO(medicalConditionRecord))
        );
        return Result.ok<IMedicalConditionDTO[]>( medicalConditionDTOResults )
        }
    } catch (e) {
      throw e;
    }
  }

  public async createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {

      const medicalConditionOrError = await MedicalCondition.create( medicalConditionDTO );

      if (medicalConditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(medicalConditionOrError.errorValue());
      }

      const medicalConditionResult = medicalConditionOrError.getValue();

      await this.medicalConditionRepo.save(medicalConditionResult);

      const medicalConditionDTOResult = MedicalConditionMap.toDTO( medicalConditionResult ) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {
      const medicalCondition = await this.medicalConditionRepo.findByCode(medicalConditionDTO.code);

      if (medicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("Medical Condition not found");
      }
      else {
        medicalCondition.designation = medicalConditionDTO.designation;
        medicalCondition.description = medicalConditionDTO.description;
        medicalCondition.commonSymptoms = medicalConditionDTO.commonSymptoms;
        await this.medicalConditionRepo.save(medicalCondition);

        const medicalConditionDTOResult = MedicalConditionMap.toDTO( medicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( medicalConditionDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }


  public async searchMedicalConditions(code?: string, designation?: string): Promise<Result<IMedicalConditionDTO[]>> {
    try {
      const medicalConditions = await this.medicalConditionRepo.findByCodeOrDesignation(code, designation);
  
      if (medicalConditions.length === 0) {
        return Result.fail<IMedicalConditionDTO[]>("No Medical Conditions found");
      }
  
      const medicalConditionsDTOResults = await Promise.all(
        medicalConditions.map(medicalCondition => MedicalConditionMap.toDTO(medicalCondition))
      );
      return Result.ok<IMedicalConditionDTO[]>(medicalConditionsDTOResults);
    } catch (e) {
      throw e;
    }
  }
  

}
