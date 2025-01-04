import * as sinon from 'sinon';
import { expect } from 'chai';

import MedicalConditionService from '../src/services/medicalConditionService';
import IMedicalConditionRepo from '../src/services/IRepos/IMedicalConditionRepo';
import { Result } from "../src/core/logic/Result";
import { MedicalConditionMap } from '../src/mappers/MedicalConditionMap';
import { IMedicalConditionDTO } from '../src/dto/IMedicalConditionDTO';
import { MedicalCondition } from '../src/domain/MedicalCondition/medicalCondition';

describe('MedicalConditionService', () => {
  let medicalConditionRepoStub: sinon.SinonStubbedInstance<IMedicalConditionRepo>;
  let medicalConditionService: MedicalConditionService;
  let mockMedicalCondition: any;

  beforeEach(() => {
    medicalConditionRepoStub = {
      findByDomainId: sinon.stub(),
      save: sinon.stub(),
      findAll: sinon.stub(),
      findByCode: sinon.stub(),
      findByCodeOrDesignation: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<IMedicalConditionRepo>;

    mockMedicalCondition = {
      id: 'some-id',
      code: 'M001',
      designation: 'Hypertension',
      description: 'High blood pressure',
      commonSymptoms: ['Headache', 'Fatigue'],
    };

    medicalConditionRepoStub.findByDomainId.resolves(mockMedicalCondition as unknown as MedicalCondition);
    medicalConditionService = new MedicalConditionService(medicalConditionRepoStub);
  });

  describe('getMedicalConditionById', () => {
    it('should return a successful result if medical condition is found', async () => {
      const result = await medicalConditionService.getMedicalConditionById('M001');

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal(MedicalConditionMap.toDTO(mockMedicalCondition as unknown as MedicalCondition));
    });

    it('should return a failure result if medical condition is not found', async () => {
      medicalConditionRepoStub.findByDomainId.resolves(null);

      const result = await medicalConditionService.getMedicalConditionById('M999');

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("Medical Condition not found");
    });
  });

  describe('getMedicalConditions', () => {
    it('should return a successful result if medical conditions are found', async () => {
      medicalConditionRepoStub.findAll.resolves([mockMedicalCondition]);

      const result = await medicalConditionService.getMedicalConditions();

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal([MedicalConditionMap.toDTO(mockMedicalCondition as unknown as MedicalCondition)]);
    });

    it('should return a failure result if no medical conditions are found', async () => {
      medicalConditionRepoStub.findAll.resolves([]);

      const result = await medicalConditionService.getMedicalConditions();

      expect(result.isFailure).to.be.false;
      expect(result.error).to.equal(null);
    });
  });

  describe('createMedicalCondition', () => {
    it('should return a success result if medical condition is created successfully', async () => {
      const medicalConditionDTO: IMedicalConditionDTO = {
        code: 'M002',
        designation: 'Diabetes',
        description: 'High blood sugar',
        commonSymptoms: 'Increased thirst',
      };
      const newMockMedicalCondition = {
        id: 'new-id',
        code: 'M002',
        ...medicalConditionDTO,
      };

      const createStub = sinon.stub(MedicalCondition, 'create').resolves(Result.ok(newMockMedicalCondition as unknown as MedicalCondition));
      medicalConditionRepoStub.save.resolves(newMockMedicalCondition as unknown as MedicalCondition);

      const result = await medicalConditionService.createMedicalCondition(medicalConditionDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue().code).to.equal('M002');

      createStub.restore();
    });

    it('should return a failure result if medical condition creation fails', async () => {
      const medicalConditionDTO: IMedicalConditionDTO = {
        code: 'M002',
        designation: 'Diabetes',
        description: 'High blood sugar',
        commonSymptoms: 'Increased thirst',
      };
      const error = "Medical Condition creation failed";

      const createStub = sinon.stub(MedicalCondition, 'create').resolves(Result.fail(error));

      const result = await medicalConditionService.createMedicalCondition(medicalConditionDTO);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal(error);

      createStub.restore();
    });
  });

  describe('updateMedicalCondition', () => {
    it('should return a success result if medical condition is updated successfully', async () => {
      const medicalConditionDTO: IMedicalConditionDTO = {
        code: 'M001',
        designation: 'Updated Hypertension',
        description: 'Updated description',
        commonSymptoms: 'Headache, Dizziness',
      };

      medicalConditionRepoStub.findByCode.resolves(mockMedicalCondition);
      medicalConditionRepoStub.save.resolves(mockMedicalCondition);

      const result = await medicalConditionService.updateMedicalCondition(medicalConditionDTO);

      expect(result.isSuccess).to.be.true;
      expect(result.getValue().designation).to.equal('Updated Hypertension');
    });

    it('should return a failure result if medical condition is not found', async () => {
      medicalConditionRepoStub.findByCode.resolves(null);

      const medicalConditionDTO: IMedicalConditionDTO = {
        code: 'M999',
        designation: 'Nonexistent Condition',
        description: 'No description',
        commonSymptoms: '',
      };

      const result = await medicalConditionService.updateMedicalCondition(medicalConditionDTO);

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("Medical Condition not found");
    });
  });

  describe('searchMedicalConditions', () => {
    it('should return a successful result if matching medical conditions are found', async () => {
      medicalConditionRepoStub.findByCodeOrDesignation.resolves([mockMedicalCondition]);

      const result = await medicalConditionService.searchMedicalConditions('M001');

      expect(result.isSuccess).to.be.true;
      expect(result.getValue()).to.deep.equal([MedicalConditionMap.toDTO(mockMedicalCondition as unknown as MedicalCondition)]);
    });

    it('should return a failure result if no matching medical conditions are found', async () => {
      medicalConditionRepoStub.findByCodeOrDesignation.resolves([]);

      const result = await medicalConditionService.searchMedicalConditions('M999');

      expect(result.isFailure).to.be.true;
      expect(result.error).to.equal("No Medical Conditions found");
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
