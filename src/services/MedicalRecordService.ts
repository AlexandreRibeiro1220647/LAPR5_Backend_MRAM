import { Inject, Service } from 'typedi';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import config from '../../config';
import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import { Result } from '../core/logic/Result';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';
import { MedicalRecord } from '../domain/MedicalRecord/medicalRecord';
import { Allergy } from '../domain/Allergy/allergy';
import { AllergyMap } from '../mappers/AllergyMap';
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import { MedicalCondition } from '../domain/MedicalCondition/medicalCondition';


@Service()
export default class MedicalRecordService implements IMedicalRecordService {

  constructor(@Inject(config.repos.medicalRecord.name) private medicalRecordRepo: IMedicalRecordRepo) {}


  public async createMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      // Create a new medical record using the provided DTO.
      const medicalRecordOrError = await MedicalRecord.create(medicalRecordDTO);

      if (medicalRecordOrError.isFailure) {
        // If creation failed, return a failure result with the error.
        return Result.fail<IMedicalRecordDTO>(medicalRecordOrError.errorValue());
      }

      const medicalRecordResult = medicalRecordOrError.getValue(); // Get the created medical record entity.

      // Save the created medical record to the repository.
      await this.medicalRecordRepo.save(medicalRecordResult);

      // Map the saved medical record to a DTO.
      const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecordResult) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult); // Return success result with the created DTO.
    } catch (e) {
      throw e; // Propagate error if an exception occurs.
    }
  }


  public async updateMedicalRecord(medicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      // Find the medical record by its ID.
      const medicalRecord = await this.medicalRecordRepo.findById(medicalRecordDTO.id);

      if (medicalRecord === null) {
        // If medical record not found, return a failure result.
        return Result.fail<IMedicalRecordDTO>('Medical Record not found');
      } else {
        // Map the allergies from the DTO to domain objects and update the medical record.
        medicalRecord.allergies = medicalRecordDTO.allergies.map(
          allergy => AllergyMap.toDomain(allergy) as Allergy
        );

        // Map the medical conditions from the DTO to domain objects and update the medical record.
        medicalRecord.conditions = medicalRecordDTO.conditions.map(
          condition => MedicalConditionMap.toDomain(condition) as MedicalCondition,
        );

        // Save the updated medical record to the repository.
        await this.medicalRecordRepo.save(medicalRecord);

        // Map the updated medical record to a DTO.
        const medicalRecordDTOResult = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>(medicalRecordDTOResult); // Return success result with the updated DTO.
      }
    } catch (e) {
      throw e; // Propagate error if an exception occurs.
    }
  }


  public async getMedicalRecord(medicalRecordId: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      // Find the medical record by its ID.
      const medicalRecord = await this.medicalRecordRepo.findById(medicalRecordId);

      if (medicalRecord === null) {
        // If medical record not found, return a failure result.
        return Result.fail<IMedicalRecordDTO>('Medical Record not found');
      }

      // Map the found medical record to a DTO.
      const medicalRecordDTO = MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>(medicalRecordDTO); // Return success result with the found DTO.
    } catch (e) {
      throw e; // Propagate error if an exception occurs.
    }
  }


  public async getMedicalRecords(): Promise<Result<IMedicalRecordDTO[]>> {
    try {
      // Fetch all medical records from the repository.
      const medicalRecords = await this.medicalRecordRepo.findAll();

      // Map the medical record entities to DTOs.
      const medicalRecordDTOs = medicalRecords.map(
        medicalRecord => MedicalRecordMap.toDTO(medicalRecord) as IMedicalRecordDTO,
      );

      return Result.ok<IMedicalRecordDTO[]>(medicalRecordDTOs); // Return success result with the mapped DTOs.
    } catch (e) {
      throw e; // Propagate error if an exception occurs.
    }
  }
}
