import { Repo } from "../../core/infra/Repo";
import { Allergy } from "../../domain/Allergy/allergy";
import { AllergyId } from "../../domain/Allergy/allergyId";

export default interface IAllergyRepo extends Repo<Allergy> {
	save(user: Allergy): Promise<Allergy>;
	findByCode (code: string): Promise<Allergy>;
	findByDomainId (allergyId: AllergyId | string): Promise<Allergy>;
	findAll(): Promise<Allergy[]>;
}
  