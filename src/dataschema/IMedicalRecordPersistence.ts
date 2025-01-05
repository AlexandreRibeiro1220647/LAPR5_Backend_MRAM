import { Allergy } from '../domain/allergy/allergy';
import {MedicalCondition} from "../domain/medicalCondition/medicalCondition";
import {Entry} from "../domain/MedicalRecord/entry";

export interface IMedicalRecordPersistence {
  patient: string;
  allergies: Allergy[];
  conditions: MedicalCondition[];
}
