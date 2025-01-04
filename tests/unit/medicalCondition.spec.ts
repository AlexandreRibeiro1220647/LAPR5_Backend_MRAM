import { MedicalCondition } from "../../src/domain/MedicalCondition/medicalCondition";

const { expect: chaiExpect } = require("chai");


describe("MedicalCondition Entity", () => {
  const validProps = {
    code: "M001",
    designation: "Hypertension",
    description: "A condition in which the blood pressure is consistently too high.",
    commonSymptoms: "Headache, Shortness of breath, Nosebleeds"
  };

  it("should create a MedicalCondition successfully with valid props", () => {
    const result = MedicalCondition.create(validProps);

    chaiExpect(result.isSuccess).to.be.true;
    const medicalCondition = result.getValue();
    chaiExpect(medicalCondition).to.be.instanceOf(MedicalCondition);
    chaiExpect(medicalCondition.code).to.equal(validProps.code);
    chaiExpect(medicalCondition.designation).to.equal(validProps.designation);
    chaiExpect(medicalCondition.description).to.equal(validProps.description);
    chaiExpect(medicalCondition.commonSymptoms).to.equal(validProps.commonSymptoms);
  });

  it("should create a MedicalCondition ifcode is empty", () => {
    const invalidProps = {
      code: '',
      designation: validProps.designation,
      description: validProps.description,
      commonSymptoms: validProps.commonSymptoms,
    };

    const result = MedicalCondition.create(invalidProps);

    chaiExpect(result.isSuccess).to.be.true;
    chaiExpect(result.error).to.equal(null);
  });

  it("should set and get designation correctly", () => {
    const result = MedicalCondition.create(validProps);
    const medicalCondition = result.getValue();

    medicalCondition.designation = "Chronic Hypertension";

    chaiExpect(medicalCondition.designation).to.equal("Chronic Hypertension");
  });

  it("should set and get description correctly", () => {
    const result = MedicalCondition.create(validProps);
    const medicalCondition = result.getValue();

    medicalCondition.description = "A more severe form of hypertension with higher risks.";

    chaiExpect(medicalCondition.description).to.equal("A more severe form of hypertension with higher risks.");
  });

  it("should set and get commonSymptoms correctly", () => {
    const result = MedicalCondition.create(validProps);
    const medicalCondition = result.getValue();

    medicalCondition.commonSymptoms = "Severe headaches, Chest pain";

    chaiExpect(medicalCondition.commonSymptoms).to.equal("Severe headaches, Chest pain");
  });

});
