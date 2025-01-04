import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/MedicalCondition/medicalCondition";
import { MedicalConditionId } from "../../domain/MedicalCondition/medicalConditionId";
import { IMedicalConditionDTO } from "../../dto/IMedicalConditionDTO";

export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
	save(medicalCondition: MedicalCondition): Promise<MedicalCondition>;
	findByCode (code: string): Promise<MedicalCondition>;
	findByDomainId (medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition>;
	findAll(): Promise<MedicalCondition[]>;
	findByCodeOrDesignation(code?: string, designation?: string): Promise<MedicalCondition[]>;
}
  