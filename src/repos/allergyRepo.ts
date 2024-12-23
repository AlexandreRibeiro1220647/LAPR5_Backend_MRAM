import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IAllergyPersistence } from '../dataschema/IAllergyPersistence';

import IAllergyRepo from "../services/IRepos/IAllergyRepo";
import { Allergy } from "../domain/Allergy/allergy";
import { AllergyId } from "../domain/Allergy/allergyId";
import { AllergyMap } from '../mappers/AllergyMap';
@Service()
export default class AllergyRepo implements IAllergyRepo {
  private models: any;

  constructor(
    @Inject('allergySchema') private allergySchema : Model<IAllergyPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists (allergyId: AllergyId | string): Promise<boolean> {

    const idX = allergyId instanceof AllergyId ? (<AllergyId>allergyId).id.toValue() : allergyId;

    const query = { domainId: idX}; 
    const allergyDocument = await this.allergySchema.findOne( query );

    return !!allergyDocument === true;
  }

  public async save (allergy: Allergy): Promise<Allergy> {
    const query = { domainId: allergy.id.toString() }; 

    const allergyDocument = await this.allergySchema.findOne( query );

    try {
      if (allergyDocument === null ) {
        const rawAllergy: any = AllergyMap.toPersistence(allergy);

        const allergyCreated = await this.allergySchema.create(rawAllergy);

        return AllergyMap.toDomain(allergyCreated);
      } else {
        allergyDocument.code = allergy.code;
        allergyDocument.designation = allergy.designation;
        allergyDocument.description = allergy.description;
        await allergyDocument.save();

        return allergy;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByCode (code: string): Promise<Allergy> {
    const query = { code: code };
    const allergyRecord = await this.allergySchema.findOne( query );

    if( allergyRecord != null) {
      return AllergyMap.toDomain(allergyRecord);
    }
    else
      return null;
  }


  public async findByDomainId (allergyId: AllergyId | string): Promise<Allergy> {
    const query = { domainId: allergyId};
    const allergyRecord = await this.allergySchema.findOne( query as FilterQuery<IAllergyPersistence & Document> );
  
    if( allergyRecord != null) {
      return AllergyMap.toDomain(allergyRecord);
    }
    else
      return null;
  }

  public async findAll(): Promise<Allergy[]> {
    const allergyRecords = await this.allergySchema.find({}); // Fetch all records
  
    if (allergyRecords.length > 0) {
      const allergies = await Promise.all(
        allergyRecords.map(allergyRecord => AllergyMap.toDomain(allergyRecord))
      );
      return allergies;
    } else {
      return [];
    }
  }  
  
}