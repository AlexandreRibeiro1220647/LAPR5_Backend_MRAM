import { Allergy } from '../domain/Allergy/allergy';
import { MedicalCondition } from "../domain/MedicalCondition/medicalCondition";

export interface IMedicalRecordPersistence {
  patient: string;
  allergies: Allergy[];
  conditions: MedicalCondition[];
}
