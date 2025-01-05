import { IAllergyDTO } from './IAllergyDTO';
import { IMedicalConditionDTO } from "./IMedicalConditionDTO";

export default interface IMedicalRecordDTO {
  id: string;
  patient: string;
  allergies: IAllergyDTO[];
  conditions: IMedicalConditionDTO[];
}
