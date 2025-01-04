import { Result } from "../../core/logic/Result";
import { MedicalCondition } from "../../domain/MedicalCondition/medicalCondition";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";

export default interface IMedicalConditionService  {
  createMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;
  updateMedicalCondition(medicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>>;

  getMedicalConditionById (medicalConditionId: string): Promise<Result<IMedicalConditionDTO>>;
  getMedicalConditions(): Promise<Result<IMedicalConditionDTO[]>>;
  searchMedicalConditions(code?: string, designation?: string): Promise<Result<IMedicalConditionDTO[]>>;
}
