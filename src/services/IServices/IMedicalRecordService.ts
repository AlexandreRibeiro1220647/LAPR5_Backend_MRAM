import IMedicalRecordDTO from '../../dto/IMedicalRecordDTO';
import { Result } from '../../core/logic/Result';

export default interface IMedicalRecordService {
  createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord(medicalRecordId: string): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>>;
}
