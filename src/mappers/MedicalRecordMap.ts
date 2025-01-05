import { MedicalRecord } from '../domain/MedicalRecord/medicalRecord';
import { Mapper } from '../core/infra/Mapper';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { AllergyMap } from './AllergyMap';
import { Document, Model } from 'mongoose';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';
import { MedicalConditionMap } from './MedicalConditionMap';


export class MedicalRecordMap extends Mapper<MedicalRecord> {
 
  public static toDTO(medicalRecord: MedicalRecord): IMedicalRecordDTO {
    // Maps allergies to their DTO representation.
    const allergiesDTO = medicalRecord.allergies.map(allergy => AllergyMap.toDTO(allergy));

    // Maps medical conditions to their DTO representation.
    const conditionsDTO = medicalRecord.conditions.map(condition => MedicalConditionMap.toDTO(condition));

    return {
      id: medicalRecord.id.toString(), // Converts the unique ID to a string representation.
      patient: medicalRecord.patient, // Maps the patient identifier.
      allergies: allergiesDTO, // Includes mapped allergies as DTOs.
      conditions: conditionsDTO, // Includes mapped medical conditions as DTOs.
    } as IMedicalRecordDTO;
  }

 
  public static toDomain(medicalRecord: any | Model<IMedicalRecordPersistence & Document>): MedicalRecord {
    const medicalRecordOrError = MedicalRecord.create(
      medicalRecord,
      medicalRecord._id, // Passes the MongoDB `_id` as the unique identifier for the domain entity.
    );

    // Logs an error if the domain object creation fails.
    if (medicalRecordOrError.isFailure) {
      console.log(medicalRecordOrError.error);
    }

    // Returns the domain object if successful; otherwise, returns null.
    return medicalRecordOrError.isSuccess ? medicalRecordOrError.getValue() : null;
  }

  public static toPersistence(medicalRecord: MedicalRecord): any {
    // Maps allergies to their persistence representation.
    const allergiesPersistence = medicalRecord.allergies.map(allergy => AllergyMap.toPersistence(allergy));

    // Maps medical conditions to their persistence representation.
    const conditionsPersistence = medicalRecord.conditions.map(condition =>
      MedicalConditionMap.toPersistence(condition),
    );

    return {
      id: medicalRecord.id.toString(), // Converts the unique ID to a string for storage.
      patient: medicalRecord.patient, // Maps the patient identifier.
      allergies: allergiesPersistence, // Includes mapped allergies for persistence.
      conditions: conditionsPersistence, // Includes mapped medical conditions for persistence.
    };
  }
}
