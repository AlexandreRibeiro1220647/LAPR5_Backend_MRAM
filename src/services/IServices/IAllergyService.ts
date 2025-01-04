import { Result } from "../../core/logic/Result";
import { IAllergyDTO } from "../../dto/IAllergyDTO";

export default interface IAllergyService  {
  createAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;
  updateAllergy(allergyDTO: IAllergyDTO): Promise<Result<IAllergyDTO>>;

  getAllergyById (allergyId: string): Promise<Result<IAllergyDTO>>;
  getAllergies(): Promise<Result<IAllergyDTO[]>>;

  searchAllergies(code?: string, designation?: string): Promise<Result<IAllergyDTO[]>>;
}
