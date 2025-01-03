import * as sinon from 'sinon';
import AllergyService from '../../../src/services/allergyService';
import IAllergyRepo from '../../../src/services/IRepos/IAllergyRepo';
import { Result } from "../../../src/core/logic/Result";
import { Allergy } from "../../../src/domain/Allergy/allergy";
import { AllergyMap } from "../../../src/mappers/AllergyMap";
import { IAllergyDTO } from '../../../src/dto/IAllergyDTO';

describe('AllergyService', () => {
  let allergyRepoStub: sinon.SinonStubbedInstance<IAllergyRepo>;
  let allergyService: AllergyService;
  let mockAllergy: any;

  beforeEach(() => {
    // Mock the methods manually since IAllergyRepo is an interface
    allergyRepoStub = {
      findByDomainId: sinon.stub(),
      save: sinon.stub(),
    } as sinon.SinonStubbedInstance<IAllergyRepo>;

    // Mocking the resolved value for findByDomainId
    mockAllergy = {
      id: 'some-id',
      allergyId: 'A001',
      code: 'A001',
      designation: 'Peanut Allergy',
      description: 'Reaction to peanuts',
      domainEvents: [],
    };
    allergyRepoStub.findByDomainId.resolves(mockAllergy as unknown as Allergy);

    // Creating the AllergyService instance with the stub
    allergyService = new AllergyService(allergyRepoStub);
  });

  describe('getAllergyById', () => {
    it('should return a successful result if allergy is found', async () => {
      const result = await allergyService.getAllergyById('A001');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toEqual(AllergyMap.toDTO(mockAllergy as unknown as Allergy));
    });

    it('should return a failure result if allergy is not found', async () => {
      allergyRepoStub.findByDomainId.resolves(null);

      const result = await allergyService.getAllergyById('A999');

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe("Allergy not found");
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

      // Stub the Allergy.create method and allergyRepo.save method
      sinon.stub(Allergy, 'create').resolves(Result.ok(newMockAllergy as unknown as Allergy));
      allergyRepoStub.save.resolves(newMockAllergy as unknown as Allergy);

      const result = await allergyService.createAllergy(allergyDTO);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().code).toBe('A003');
      sinon.restore();
    });

    it('should return a failure result if allergy creation fails', async () => {
      const allergyDTO: IAllergyDTO = { code: 'A003', designation: 'Dust Allergy', description: 'Reaction to dust' };
      const error = "Allergy creation failed";

      sinon.stub(Allergy, 'create').resolves(Result.fail(error));

      const result = await allergyService.createAllergy(allergyDTO);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(error);
      sinon.restore();
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});
