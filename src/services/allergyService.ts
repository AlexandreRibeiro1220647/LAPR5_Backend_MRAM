import { Service, Inject } from 'typedi';
import config from "../../config";
import { IAllergyDTO } from '../dto/IAllergyDTO';
import { Allergy } from "../domain/Allergy/allergy";
import IAllergyRepo from './IRepos/IAllergyRepo';
import IAllergyService from './IServices/IAllergyService';
import { Result } from "../core/logic/Result";
import { AllergyMap } from "../mappers/AllergyMap";

@Service()
export default class AllergyService implements IAllergyService {
  constructor(
      @Inject(config.repos.allergy.name) private allergyRepo : IAllergyRepo
  ) {}

  public async getAllergyById( allergyId: string): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByDomainId(allergyId);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getAllergies(): Promise<Result<IAllergyDTO[]>> {
    try {
      const allergies = await this.allergyRepo.findAll();

      if (allergies === null) {
        return Result.fail<IAllergyDTO[]>("Allergies not found");
      }
      else {
        const allergyDTOResults = await Promise.all(
          allergies.map(allergyRecord => AllergyMap.toDTO(allergyRecord))
        );
        return Result.ok<IAllergyDTO[]>( allergyDTOResults )
        }
    } catch (e) {
      throw e;
    }
  }

  public async createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {

      const allergyOrError = await Allergy.create( allergyDTO );

      if (allergyOrError.isFailure) {
        return Result.fail<IAllergyDTO>(allergyOrError.errorValue());
      }

      const allergyresult = allergyOrError.getValue();

      await this.allergyRepo.save(allergyresult);

      const allergyDTOResult = AllergyMap.toDTO( allergyresult ) as IAllergyDTO;
      return Result.ok<IAllergyDTO>( allergyDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>> {
    try {
      const allergy = await this.allergyRepo.findByCode(allergyDTO.code);

      if (allergy === null) {
        return Result.fail<IAllergyDTO>("Allergy not found");
      }
      else {
        allergy.designation = allergyDTO.designation;
        allergy.description = allergyDTO.description;
        await this.allergyRepo.save(allergy);

        const allergyDTOResult = AllergyMap.toDTO( allergy ) as IAllergyDTO;
        return Result.ok<IAllergyDTO>( allergyDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
