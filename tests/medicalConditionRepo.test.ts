import { expect } from 'chai';
import sinon, { mock, SinonMock } from 'sinon';
import  MedicalConditionRepo  from '../src/repos/medicalConditionRepo';
import { MedicalCondition } from '../src/domain/MedicalCondition/medicalCondition';
import { MedicalConditionId } from '../src/domain/MedicalCondition/medicalConditionId';
import { MedicalConditionMap } from '../src/mappers/MedicalConditionMap';

describe('MedicalConditionRepo', () => {
  let medicalConditionRepo: MedicalConditionRepo;
  let medicalConditionSchemaMock: SinonMock;
  let loggerMock: SinonMock;

  beforeEach(() => {
    const medicalConditionSchema = {
      findOne: () => {},
      create: () => {},
      find: () => {},
    };

    // Criar mock do medicalConditionSchema
    medicalConditionSchemaMock = mock(medicalConditionSchema);

    // Mock do logger
    const logger = {
      info: () => {},
      error: () => {},
    };
    loggerMock = mock(logger);

    medicalConditionRepo = new MedicalConditionRepo(medicalConditionSchema as any, logger as any);
  });

  afterEach(() => {
    medicalConditionSchemaMock.restore();
    loggerMock.restore();
    sinon.restore();
  });

  describe('findByCode', () => {
    it('should return a medical condition by its code', async () => {
      const code = 'Code';
      const medicalConditionRecord = {
        domainId: 'some-id',
        code: 'Code',
        designation: 'Designation',
        description: 'Description',
        commonSymptoms: 'Common Symptoms',
      };

      medicalConditionSchemaMock.expects('findOne').withArgs({ code }).resolves(medicalConditionRecord);

      const result = await medicalConditionRepo.findByCode(code);
      expect(result).to.be.an.instanceOf(MedicalCondition);
      expect(result.code).to.equal('Code');

      medicalConditionSchemaMock.verify();
    });

    it('should return null if no medical condition is found by code', async () => {
      const code = 'Code';

      medicalConditionSchemaMock.expects('findOne').withArgs({ code }).resolves(null);

      const result = await medicalConditionRepo.findByCode(code);
      expect(result).to.be.null;

      medicalConditionSchemaMock.verify();
    });
  });

  describe('findAll', () => {
    it('should return all medical conditions', async () => {
      const medicalConditionRecords = [
        { domainId: 'some-id1', code: 'Code1', designation: 'Designation1', description: 'Description1', commonSymptoms: 'Symptoms1' },
        { domainId: 'some-id2', code: 'Code2', designation: 'Designation2', description: 'Description2', commonSymptoms: 'Symptoms2' },
      ];
      medicalConditionSchemaMock.expects('find').withArgs({}).resolves(medicalConditionRecords);

      const result = await medicalConditionRepo.findAll();
      expect(result).to.be.an('array').that.has.lengthOf(2);

      medicalConditionSchemaMock.verify();
    });

    it('should return an empty array if no medical conditions exist', async () => {
      medicalConditionSchemaMock.expects('find').withArgs({}).resolves([]);

      const result = await medicalConditionRepo.findAll();
      expect(result).to.be.an('array').that.is.empty;

      medicalConditionSchemaMock.verify();
    });
  });

});
