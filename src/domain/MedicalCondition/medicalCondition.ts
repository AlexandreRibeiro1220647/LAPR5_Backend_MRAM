import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { MedicalConditionId } from "./medicalConditionId";
import { Guard } from "../../core/logic/Guard";


interface MedicalConditionProps {
  code : string;
  designation : string;
  description : string;
  commonSymptoms : string
}

export class MedicalCondition extends AggregateRoot<MedicalConditionProps> {
  get id (): UniqueEntityID {
    return this._id;
  }

  get medicalConditionId (): MedicalConditionId {
    return MedicalConditionId.caller(this.id)
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

  get commonSymptoms (): string {
    return this.props.commonSymptoms;
  }

  set designation ( value: string) {
    this.props.designation = value;
  }

  set description ( value: string) {
    this.props.description = value;
  }

  set commonSymptoms ( value: string) {
    this.props.commonSymptoms = value;
  }

  private constructor (props: MedicalConditionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: MedicalConditionProps, id?: UniqueEntityID): Result<MedicalCondition> {

    const guardedProps = [
      { argument: props.code, argumentName: 'code' },
      { argument: props.designation, argumentName: 'designation' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.commonSymptoms, argumentName: 'commonSymptoms' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<MedicalCondition>(guardResult.message)
    }     
    else {
      const medicalCondition = new MedicalCondition({
        ...props
      }, id);

      return Result.ok<MedicalCondition>(medicalCondition);
    }
  }
}