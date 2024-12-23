import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { AllergyId } from "./allergyId";
import { Guard } from "../../core/logic/Guard";


interface AllergyProps {
  code : string;
  designation : string;
  description : string
}

export class Allergy extends AggregateRoot<AllergyProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get allergyId (): AllergyId {
    return AllergyId.caller(this.id)
  }

  get code (): string {
    return this.props.code
  }

  get designation (): string {
    return this.props.designation;
  }

  get description (): string {
    return this.props.description;
  }

  set designation ( value: string) {
    this.props.designation = value;
  }

  set description ( value: string) {
    this.props.description = value;
  }

  private constructor (props: AllergyProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: AllergyProps, id?: UniqueEntityID): Result<Allergy> {

    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.designation, argumentName: 'designation' },
      { argument: props.description, argumentName: 'description' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Allergy>(guardResult.message)
    }     
    else {
      const allergy = new Allergy({
        ...props
      }, id);

      return Result.ok<Allergy>(allergy);
    }
  }
}