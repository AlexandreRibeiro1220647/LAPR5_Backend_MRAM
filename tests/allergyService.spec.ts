import * as sinon from 'sinon';
const { expect: chaiExpect } = require("chai");

import AllergyService from '../src/services/allergyService';
import IAllergyRepo from '../src/services/IRepos/IAllergyRepo';
import { Result } from "../src/core/logic/Result";
import { Allergy } from "../src/domain/Allergy/allergy";
import { AllergyMap } from "../src/mappers/AllergyMap";
import { IAllergyDTO } from '../src/dto/IAllergyDTO';

describe('AllergyService', () => {
  let allergyRepoStub: sinon.SinonStubbedInstance<IAllergyRepo>;
  let allergyService: AllergyService;
  let mockAllergy: any;

  beforeEach(() => {
    allergyRepoStub = {
      findByDomainId: sinon.stub(),
      save: sinon.stub(),
      findAll: sinon.stub(),
      findByCode: sinon.stub(),
      findByCodeOrDesignation: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IAllergyRepo>;

    mockAllergy = {
      id: 'some-id',
      allergyId: 'A001',
      code: 'A001',
      designation: 'Peanut Allergy',
      description: 'Reaction to peanuts',
      domainEvents: [],
    };

    allergyRepoStub.findByDomainId.resolves(mockAllergy as unknown as Allergy);
    allergyService = new AllergyService(allergyRepoStub);
  });

  describe('getAllergyById', () => {
    it('should return a successful result if allergy is found', async () => {
      const result = await allergyService.getAllergyById('A001');

      chaiExpect(result.isSuccess).to.be.true;
      chaiExpect(result.getValue()).to.deep.equal(AllergyMap.toDTO(mockAllergy as unknown as Allergy));
    });

    it('should return a failure result if allergy is not found', async () => {
      allergyRepoStub.findByDomainId.resolves(null);

      const result = await allergyService.getAllergyById('A999');

      chaiExpect(result.isFailure).to.be.true;
      chaiExpect(result.error).to.equal("Allergy not found");
    });
  });

  describe('getAllergies', () => {
    it('should return a successful result if allergies are found', async () => {
      allergyRepoStub.findAll.resolves([mockAllergy]);

      const result = await allergyService.getAllergies();

      chaiExpect(result.isSuccess).to.be.true;
      chaiExpect(result.getValue()).to.deep.equal([AllergyMap.toDTO(mockAllergy as unknown as Allergy)]);
    });

    it('should return a failure result if no allergies are found', async () => {
      allergyRepoStub.findAll.resolves([]);

      const result = await allergyService.getAllergies();

      chaiExpect(result.isFailure).to.be.false;
      chaiExpect(result.error).to.equal(null);
    });
  });

  describe('createAllergy', () => {
    it('should return a success result if allergy is created successfully', async () => {
      const allergyDTO: IAllergyDTO = { code: 'A003', designation: 'Dust Allergy', description: 'Reaction to dust' };
      const newMockAllergy = {
        id: 'new-id',
        allergyId: 'A003',
        ...allergyDTO,
        domainEvents: [],
      };

      const createStub = sinon.stub(Allergy, 'create').resolves(Result.ok(newMockAllergy as unknown as Allergy));
      allergyRepoStub.save.resolves(newMockAllergy as unknown as Allergy);

      const result = await allergyService.createAllergy(allergyDTO);

      chaiExpect(result.isSuccess).to.be.true;
      chaiExpect(result.getValue().code).to.equal('A003');

      createStub.restore();
    });

    it('should return a failure result if allergy creation fails', async () => {
      const allergyDTO: IAllergyDTO = { code: 'A003', designation: 'Dust Allergy', description: 'Reaction to dust' };
      const error = "Allergy creation failed";

      const createStub = sinon.stub(Allergy, 'create').resolves(Result.fail(error));

      const result = await allergyService.createAllergy(allergyDTO);

      chaiExpect(result.isFailure).to.be.true;
      chaiExpect(result.error).to.equal(error);

      createStub.restore();
    });
  });

  describe('updateAllergy', () => {
    it('should return a success result if allergy is updated successfully', async () => {
      const allergyDTO: IAllergyDTO = { code: 'A001', designation: 'Updated Allergy', description: 'Updated description' };

      allergyRepoStub.findByCode.resolves(mockAllergy);
      allergyRepoStub.save.resolves(mockAllergy);

      const result = await allergyService.updateAllergy(allergyDTO);

      chaiExpect(result.isSuccess).to.be.true;
      chaiExpect(result.getValue().designation).to.equal('Updated Allergy');
    });

    it('should return a failure result if allergy is not found', async () => {
      allergyRepoStub.findByCode.resolves(null);

      const allergyDTO: IAllergyDTO = { code: 'A999', designation: 'Nonexistent Allergy', description: 'No description' };

      const result = await allergyService.updateAllergy(allergyDTO);

      chaiExpect(result.isFailure).to.be.true;
      chaiExpect(result.error).to.equal("Allergy not found");
    });
  });

  describe('searchAllergies', () => {
    it('should return a successful result if matching allergies are found', async () => {
      allergyRepoStub.findByCodeOrDesignation.resolves([mockAllergy]);

      const result = await allergyService.searchAllergies('A001');

      chaiExpect(result.isSuccess).to.be.true;
      chaiExpect(result.getValue()).to.deep.equal([AllergyMap.toDTO(mockAllergy as unknown as Allergy)]);
    });

    it('should return a failure result if no matching allergies are found', async () => {
      allergyRepoStub.findByCodeOrDesignation.resolves([]);

      const result = await allergyService.searchAllergies('A999');

      chaiExpect(result.isFailure).to.be.true;
      chaiExpect(result.error).to.equal("No allergies found");
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
