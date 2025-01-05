import { Allergy } from '../Allergy/allergy';
import { AggregateRoot } from '../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { MedicalRecordId } from './medicalRecordId';
import IMedicalRecordDTO from '../../dto/IMedicalRecordDTO';
import { Result } from '../../core/logic/Result';
import { MedicalCondition } from '../MedicalCondition/medicalCondition';

interface MedicalRecordProps {
  patient: string;
  allergies: Allergy[];
  conditions: MedicalCondition[];
}

export class MedicalRecord extends AggregateRoot<MedicalRecordProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get medicalRecordId(): MedicalRecordId {
    return new MedicalRecordId(this.id.toValue());
  }

  get patient(): string {
    return this.props.patient;
  }

  set patient(value: string) {
    this.props.patient = value;
  }

  get allergies(): Allergy[] {
    return this.props.allergies;
  }

  set allergies(value: Allergy[]) {
    this.props.allergies = value;
  }

  get conditions(): MedicalCondition[] {
    return this.props.conditions;
  }

  set conditions(value: MedicalCondition[]) {
    this.props.conditions = value;
  }

  private constructor(props: MedicalRecordProps, id?: UniqueEntityID) {
    super(props, id);
  }

  /**
   * Factory method to create a `MedicalRecord` instance from a DTO and an optional unique identifier.
   * - Maps `allergies` and `conditions` from plain DTOs to their respective entity instances.
   * - Validates the input, ensuring a `patient` is provided and all mapped entities are valid.
   * - If validation fails at any step, returns a failure `Result` with an appropriate error message.
   * - If validation succeeds, constructs a new `MedicalRecord` instance and returns it wrapped in a success `Result`.
   *
   * @param medicalRecordDTO - The Data Transfer Object containing the properties for the medical record.
   * @param id - An optional `UniqueEntityID` for the medical record (default is derived from the DTO if not provided).
   * @returns A `Result` object containing either a failure message or the created `MedicalRecord` instance.
   */
  public static create(medicalRecordDTO: IMedicalRecordDTO, id?: UniqueEntityID): Result<MedicalRecord> {
    const patient = medicalRecordDTO.patient; // Extract the patient identifier.

    // Map plain allergy DTOs to `Allergy` entities.
    const allergiesResult = medicalRecordDTO.allergies.map(allergyDTO =>
      Allergy.create(
        {
          designation: allergyDTO.designation,
          description: allergyDTO.description,
          code: allergyDTO.code,
        },
        new UniqueEntityID(allergyDTO.code),
      ),
    );

    // Map plain condition DTOs to `MedicalCondition` entities.
    const conditionsResult = medicalRecordDTO.conditions.map(conditionDTO =>
      MedicalCondition.create(
        {
          designation: conditionDTO.designation,
          description: conditionDTO.description,
          code: conditionDTO.code,
          commonSymptoms: conditionDTO.commonSymptoms,
        },
        new UniqueEntityID(conditionDTO.code),
      ),
    );

    // Check if any allergy creation failed.
    const failedAllergy = allergiesResult.find(result => result.isFailure);
    if (failedAllergy) {
      return Result.fail<MedicalRecord>('One or more allergies are invalid'); // Return failure result if invalid.
    }

    // Extract the valid `Allergy` instances.
    const allergies = allergiesResult.map(result => result.getValue());

    // Check if any condition creation failed.
    const failedCondition = conditionsResult.find(result => result.isFailure);
    if (failedCondition) {
      return Result.fail<MedicalRecord>('One or more conditions are invalid'); // Return failure result if invalid.
    }

    // Extract the valid `MedicalCondition` instances.
    const conditions = conditionsResult.map(result => result.getValue());

    // Validate the `patient` field.
    if (!!patient === false || patient.length === 0) {
      return Result.fail<MedicalRecord>('Must provide a patient and at least one valid allergy');
    }

    // Construct the `MedicalRecord` instance with the validated data.
    const uniqueId = id || new UniqueEntityID(medicalRecordDTO.id);
    const medicalRecord = new MedicalRecord({ patient, allergies, conditions }, uniqueId);

    // Return a success result containing the `MedicalRecord` instance.
    return Result.ok<MedicalRecord>(medicalRecord);
  }
}
