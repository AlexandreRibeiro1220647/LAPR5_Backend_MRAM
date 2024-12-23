import { Mapper } from "../core/infra/Mapper";

import { IAllergyDTO } from '../dto/IAllergyDTO';

import { Allergy } from '../domain/Allergy/allergy';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class AllergyMap extends Mapper<Allergy> {

  public static toDTO( allergy: Allergy): IAllergyDTO {
    return {
      //id: allergy.id.toString(),
      code: allergy.code,
      designation: allergy.designation,
      description: allergy.description
    } as IAllergyDTO;
  }

  public static async toDomain (raw: any): Promise<Allergy> {
    const allergyOrError = Allergy.create({
      code: raw.code,
      designation: raw.designation,
      description: raw.description,
    }, new UniqueEntityID(raw.domainId))

    allergyOrError.isFailure ? console.log(allergyOrError.error) : '';
    
    return allergyOrError.isSuccess ? allergyOrError.getValue() : null;
  }

  public static toPersistence (allergy: Allergy): any {
    const a = {
      domainId: allergy.id.toString(),
      code: allergy.code,
      designation: allergy.designation,
      description: allergy.description
    }
    return a;
  }
}