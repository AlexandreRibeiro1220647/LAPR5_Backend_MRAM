import { Inject, Service } from 'typedi';
import IMedicalRecordRepo from '../services/IRepos/IMedicalRecordRepo';
import mongoose, { Document, FilterQuery, Model } from 'mongoose';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';
import { MedicalRecord } from '../domain/MedicalRecord/medicalRecord';
import { MedicalRecordMap } from '../mappers/MedicalRecordMap';
import { MedicalRecordId } from '../domain/MedicalRecord/medicalRecordId';


@Service()
export default class MedicalRecordRepo implements IMedicalRecordRepo {
  
  constructor(
    @Inject('medicalRecordSchema') private medicalRecordSchema: Model<IMedicalRecordPersistence & Document>,
  ) {}

  
  private createBaseQuery(): any {
    return {
      where: {}, // Default query with no filters.
    };
  }

  
  public async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordSchema.find(); // Fetches all documents in the collection.
  }

  
  public async findById(medicalRecordId: string): Promise<MedicalRecord> {
    const query = { _id: medicalRecordId }; // Query by MongoDB `_id`.
    const medicalRecordRecord = await this.medicalRecordSchema.findOne(
      query as FilterQuery<IMedicalRecordPersistence & Document>,
    );

    if (medicalRecordRecord != null) {
      return MedicalRecordMap.toDomain(medicalRecordRecord); // Map the record to a domain object.
    } else return null; // Return `null` if no record is found.
  }

  
  public async exists(medicalRecord: MedicalRecord): Promise<boolean> {
    const idX =
      medicalRecord.id instanceof MedicalRecordId
        ? (<MedicalRecordId>medicalRecord.id).toValue() // Resolve ID if it's an instance of `MedicalRecordId`.
        : medicalRecord.id;

    const query = { _id: idX }; // Query by MongoDB `_id`.
    const medicalRecordRecord = await this.medicalRecordSchema.findOne(
      query as FilterQuery<IMedicalRecordPersistence & Document>,
    );
    return !!medicalRecordRecord === true; // Return `true` if the record exists, otherwise `false`.
  }

  
  public async save(medicalRecord: MedicalRecord): Promise<MedicalRecord> {
    const query = { _id: medicalRecord.id.toString() }; // Query by unique ID.
    const medicalRecordDocument = await this.medicalRecordSchema.findOne(query);

    try {
      if (medicalRecordDocument === null) {
        // Create a new document if none exists.
        const rawMedicalRecord: any = MedicalRecordMap.toPersistence(medicalRecord);
        const medicalRecordCreated = await this.medicalRecordSchema.create(rawMedicalRecord);
        return MedicalRecordMap.toDomain(medicalRecordCreated); // Map the persistence model to the domain object.
      } else {
        // Update existing document.
        medicalRecordDocument._id = medicalRecord.id.toString();
        medicalRecordDocument.patient = medicalRecord.patient;

        // Ensure all fields are preserved during mapping
        medicalRecordDocument.allergies = medicalRecord.allergies.map(allergy => ({
          ...allergy, // Preserve all properties of the allergy object
          _id: new mongoose.Types.ObjectId(), // Generate a new unique ID for allergies
          code: allergy.code,
          designation: allergy.designation,
          description: allergy.description,
        }));

        medicalRecordDocument.conditions = medicalRecord.conditions.map(condition => ({
          ...condition, // Preserve all properties of the condition object
          _id: new mongoose.Types.ObjectId(), // Generate a new unique ID for conditions
          code: condition.code,
          designation: condition.designation,
          description: condition.description,
          commonSymptoms: condition.commonSymptoms
        }));

        await medicalRecordDocument.save(); // Save the updated document.

        return medicalRecord; // Return the updated domain object.
      }
    } catch (err) {
      throw err; // Rethrow any errors encountered during save operation.
    }
  }
}
