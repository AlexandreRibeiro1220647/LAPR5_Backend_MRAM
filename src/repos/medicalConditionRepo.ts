import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';

import { MedicalCondition } from "../domain/MedicalCondition/medicalCondition";
import { MedicalConditionId } from "../domain/MedicalCondition/medicalConditionId";
import { MedicalConditionMap } from '../mappers/MedicalConditionMap';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';
import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";

@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('medicalConditionSchema') private medicalConditionSchema : Model<IMedicalConditionPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists (medicalConditionId: MedicalConditionId | string): Promise<boolean> {

    const idX = medicalConditionId instanceof MedicalConditionId ? (<MedicalConditionId>medicalConditionId).id.toValue() : medicalConditionId;

    const query = { domainId: idX}; 
    const medicalConditionDocument = await this.medicalConditionSchema.findOne( query );

    return !!medicalConditionDocument === true;
  }

  public async save (medicalCondition: MedicalCondition): Promise<MedicalCondition> {
    const query = { domainId: medicalCondition.id.toString() }; 

    const medicalConditionDocument = await this.medicalConditionSchema.findOne( query );

    try {
      if (medicalConditionDocument === null ) {
        const rawMedicalCondition: any = MedicalConditionMap.toPersistence(medicalCondition);

        const medicalConditionCreated = await this.medicalConditionSchema.create(rawMedicalCondition);

        return MedicalConditionMap.toDomain(medicalConditionCreated);
      } else {
        medicalConditionDocument.code = medicalCondition.code;
        medicalConditionDocument.designation = medicalCondition.designation;
        medicalConditionDocument.description = medicalCondition.description;
        medicalConditionDocument.commonSymptoms = medicalCondition.commonSymptoms;
        await medicalConditionDocument.save();

        return medicalCondition;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByCode (code: string): Promise<MedicalCondition> {
    const query = { code: code };
    const medicalConditionRecord = await this.medicalConditionSchema.findOne( query );

    if( medicalConditionRecord != null) {
      return MedicalConditionMap.toDomain(medicalConditionRecord);
    }
    else
      return null;
  }


  public async findByDomainId (medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {
    const query = { domainId: medicalConditionId};
    const medicalConditionRecord = await this.medicalConditionSchema.findOne( query as FilterQuery<IMedicalConditionPersistence & Document> );
  
    if( medicalConditionRecord != null) {
      return MedicalConditionMap.toDomain(medicalConditionRecord);
    }
    else
      return null;
  }

  public async findAll(): Promise<MedicalCondition[]> {
    const medicalConditionRecords = await this.medicalConditionSchema.find({}); // Fetch all records
  
    if (medicalConditionRecords.length > 0) {
      const medicalConditions = await Promise.all(
        medicalConditionRecords.map(medicalConditionRecord => MedicalConditionMap.toDomain(medicalConditionRecord))
      );
      return medicalConditions;
    } else {
      return [];
    }
  }  

    public async findByCodeOrDesignation(code?: string, designation?: string): Promise<MedicalCondition[]> {
      const query: any = {};
      
      if (code) query.code = code;
      if (designation) query.designation = { $regex: designation, $options: 'i' }; 
    
      const medicalConsitionsRecords = await this.medicalConditionSchema.find(query);
    
      if (medicalConsitionsRecords.length > 0) {
        return Promise.all(medicalConsitionsRecords.map(record => MedicalConditionMap.toDomain(record)));
      } else {
        return [];
      }
    }
     
  
}