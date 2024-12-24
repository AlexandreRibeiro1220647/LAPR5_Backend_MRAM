import { Mapper } from "../core/infra/Mapper";

import { MedicalCondition } from '../domain/MedicalCondition/medicalCondition';
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { IMedicalConditionDTO } from "../dto/IMedicalConditionDTO";

export class MedicalConditionMap extends Mapper<MedicalCondition> {

  public static toDTO(medicalCondition: MedicalCondition): IMedicalConditionDTO {
    return {
      //id: allergy.id.toString(),
      code: medicalCondition.code,
      designation: medicalCondition.designation,
      description: medicalCondition.description,
      commonSymptoms: medicalCondition.commonSymptoms
    } as IMedicalConditionDTO;
  }

  public static async toDomain (raw: any): Promise<MedicalCondition> {
    const medicalConditionOrError = MedicalCondition.create({
      code: raw.code,
      designation: raw.designation,
      description: raw.description,
      commonSymptoms: raw.commonSymptoms
    }, new UniqueEntityID(raw.domainId))

    medicalConditionOrError.isFailure ? console.log(medicalConditionOrError.error) : '';
    
    return medicalConditionOrError.isSuccess ? medicalConditionOrError.getValue() : null;
  }

  public static toPersistence (medicalCondition: MedicalCondition): any {
    const a = {
      domainId: medicalCondition.id.toString(),
      code: medicalCondition.code,
      designation: medicalCondition.designation,
      description: medicalCondition.description,
      commonSymptoms: medicalCondition.commonSymptoms
    }
    return a;
  }
}