import { MedicalRecord } from '../../domain/MedicalRecord/medicalRecord';
import { Repo } from '../../core/infra/Repo';
import { MedicalRecordId } from '../../domain/MedicalRecord/medicalRecordId';

export default interface IMedicalRecordRepo extends Repo<MedicalRecord> {
  save(medicalRecord: MedicalRecord): Promise<MedicalRecord>;
  findById(medicalRecordId: string | MedicalRecordId): Promise<MedicalRecord>;
  findAll(): Promise<MedicalRecord[]>;
}
