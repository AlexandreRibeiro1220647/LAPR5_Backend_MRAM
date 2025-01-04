const { expect: chaiExpect } = require("chai");
import { Allergy } from '../../src/domain/Allergy/allergy';

describe("Allergy Entity", () => {
  const validProps = {
    code: "A001",
    designation: "Pollen Allergy",
    description: "Allergic reaction to pollen."
  };

  it("should create an Allergy successfully with valid props", () => {
    const result = Allergy.create(validProps);

    chaiExpect(result.isSuccess).to.be.true;
    const allergy = result.getValue();
    chaiExpect(allergy).to.be.instanceOf(Allergy);
    chaiExpect(allergy.code).to.equal(validProps.code);
    chaiExpect(allergy.designation).to.equal(validProps.designation);
    chaiExpect(allergy.description).to.equal(validProps.description);
  });

  it("should  create an Allergy if code is empty ", () => {
    const invalidProps = {
      code: '',
      designation: validProps.designation,
      description: validProps.description,
    };

    const result = Allergy.create(invalidProps);

    chaiExpect(result.isSuccess).to.be.true;
    chaiExpect(result.error).to.equal(null);
  });

  it("should set and get designation correctly", () => {
    const result = Allergy.create(validProps);
    const allergy = result.getValue();

    allergy.designation = "Dust Allergy";

    chaiExpect(allergy.designation).to.equal("Dust Allergy");
  });

  it("should set and get description correctly", () => {
    const result = Allergy.create(validProps);
    const allergy = result.getValue();

    allergy.description = "Allergic reaction to dust.";

    chaiExpect(allergy.description).to.equal("Allergic reaction to dust.");
  });
});
