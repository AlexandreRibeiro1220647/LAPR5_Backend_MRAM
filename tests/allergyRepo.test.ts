import { expect } from 'chai';
import sinon, { mock, SinonMock } from 'sinon';
import AllergyRepo from '../src/repos/allergyRepo';
import { AllergyMap } from '../src/mappers/AllergyMap';
import { Allergy } from '../src/domain/Allergy/allergy';
import { AllergyId } from '../src/domain/Allergy/allergyId';

describe('AllergyRepo', () => {
  let allergyRepo: AllergyRepo;
  let allergySchemaMock: SinonMock;
  let loggerMock: SinonMock;

  beforeEach(() => {
    const allergySchema = {
      findOne: () => {},
      create: () => {},
      find: () => {},
    };

    // Criar mock do allergySchema
    allergySchemaMock = mock(allergySchema);

    // Mock do logger
    const logger = {
      info: () => {},
      error: () => {},
    };
    loggerMock = mock(logger);

    allergyRepo = new AllergyRepo(allergySchema as any, logger as any);
  });

  afterEach(() => {
    allergySchemaMock.restore(); // Restaura o mock do schema
    loggerMock.restore(); // Restaura o mock do logger
    sinon.restore(); // Limpa qualquer stub adicional
  });




describe('findByCode', () => {
    it('should return an allergy by its code', async () => {
      const code = 'Code';
      const allergyRecord = {
        domainId: 'some-id',
        code: 'Code',
        designation: 'Designation',
        description: 'Description',
      };

      allergySchemaMock.expects('findOne').withArgs({ code }).resolves(allergyRecord);

      const result = await allergyRepo.findByCode(code);
      expect(result).to.be.an.instanceOf(Allergy);
      expect(result.code).to.equal('Code');

      allergySchemaMock.verify();
    });

    it('should return null if no allergy is found by code', async () => {
      const code = 'Code';

      allergySchemaMock.expects('findOne').withArgs({ code }).resolves(null);

      const result = await allergyRepo.findByCode(code);
      expect(result).to.be.null;

      allergySchemaMock.verify();
    });
  });

describe('findAll', () => {
    it('should return all allergies', async () => {
      const allergyRecords = [
        { domainId: 'some-id1', code: 'Code1', designation: 'Designation1', description: 'Description1' },
        { domainId: 'some-id2', code: 'Code2', designation: 'Designation2', description: 'Description2' },
      ];
      allergySchemaMock.expects('find').withArgs({}).resolves(allergyRecords);

      const result = await allergyRepo.findAll();
      expect(result).to.be.an('array').that.has.lengthOf(2);

      allergySchemaMock.verify();
    });

    it('should return an empty array if no allergies exist', async () => {
      allergySchemaMock.expects('find').withArgs({}).resolves([]);

      const result = await allergyRepo.findAll();
      expect(result).to.be.an('array').that.is.empty;

      allergySchemaMock.verify();
    });
  });
});