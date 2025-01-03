import 'reflect-metadata';
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import MedicalConditionController from '../src/controllers/medicalConditionController';
import IMedicalConditionService from '../src/services/IServices/IMedicalConditionService';
import { Result } from '../src/core/logic/Result';
import { IMedicalConditionDTO } from '../src/dto/IMedicalConditionDTO';

// Mocking the dependencies
const mockLogger = { log: sinon.spy() }; // Mock logger

describe('MedicalConditionController', function () {
  const sandbox = sinon.createSandbox();

  beforeEach(function () {
    sandbox.restore();  // Reset any previous stubs, spies, or mocks before each test
    Container.reset();
    
    // Mock the service and set it in the container
    const mockMedicalConditionService: Partial<IMedicalConditionService> = {
      getMedicalConditions: sinon.stub(),
      createMedicalCondition: sinon.stub(),
      updateMedicalCondition: sinon.stub()
    };

    // Register the mock service in the container
    Container.set("MedicalConditionService", mockMedicalConditionService);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should return all medical conditions successfully (integration test with stub)', async function () {
    // Arrange
    const conditions: IMedicalConditionDTO[] = [{
      code: 'MC001',
      designation: 'Asthma',
      description: 'A condition where the airways constrict and swell.',
      commonSymptoms: 'Coughing, wheezing, shortness of breath'
    }];
    
    const req: Partial<Request> = {};
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const mockMedicalConditionService = Container.get("MedicalConditionService") as IMedicalConditionService;
    (mockMedicalConditionService.getMedicalConditions as sinon.SinonStub).returns(Result.ok(conditions));

    const ctrl = new MedicalConditionController(mockMedicalConditionService);

    // Act
    await ctrl.getMedicalConditions(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match.array.deepEquals(conditions));
    sinon.assert.calledOnce(mockMedicalConditionService.getMedicalConditions);
  });

  it('should return 404 if no medical conditions found (integration test with stub)', async function () {
    // Arrange
    const req: Partial<Request> = {};
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const mockMedicalConditionService = Container.get("MedicalConditionService") as IMedicalConditionService;
    (mockMedicalConditionService.getMedicalConditions as sinon.SinonStub).returns(Result.fail<IMedicalConditionDTO[]>("No conditions found"));

    const ctrl = new MedicalConditionController(mockMedicalConditionService);

    // Act
    await ctrl.getMedicalConditions(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
  });

  it('should create a medical condition successfully (unit test with stub)', async function () {
    // Arrange
    const body: IMedicalConditionDTO = {
      code: 'MC001',
      designation: 'Asthma',
      description: 'A condition where the airways constrict and swell.',
      commonSymptoms: 'Coughing, wheezing, shortness of breath'
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const mockMedicalConditionService = Container.get("MedicalConditionService") as IMedicalConditionService;
    (mockMedicalConditionService.createMedicalCondition as sinon.SinonStub).returns(Result.ok(body));

    const ctrl = new MedicalConditionController(mockMedicalConditionService);

    // Act
    await ctrl.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(body));
    sinon.assert.calledOnce(mockMedicalConditionService.createMedicalCondition);
  });

  it('should return 402 if medical condition creation fails (unit test with stub)', async function () {
    // Arrange
    const body: IMedicalConditionDTO = {
      code: 'MC001',
      designation: 'Asthma',
      description: 'A condition where the airways constrict and swell.',
      commonSymptoms: 'Coughing, wheezing, shortness of breath'
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const mockMedicalConditionService = Container.get("MedicalConditionService") as IMedicalConditionService;
    (mockMedicalConditionService.createMedicalCondition as sinon.SinonStub).returns(Result.fail<IMedicalConditionDTO>("Creation failed"));

    const ctrl = new MedicalConditionController(mockMedicalConditionService);

    // Act
    await ctrl.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 402);
    sinon.assert.calledOnce(res.json);
  });

  it('should update medical condition successfully (unit test with stub)', async function () {
    // Arrange
    const body: IMedicalConditionDTO = {
      code: 'MC001',
      designation: 'Asthma',
      description: 'A condition where the airways constrict and swell.',
      commonSymptoms: 'Coughing, wheezing, shortness of breath'
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const mockMedicalConditionService = Container.get("MedicalConditionService") as IMedicalConditionService;
    (mockMedicalConditionService.updateMedicalCondition as sinon.SinonStub).returns(Result.ok(body));

    const ctrl = new MedicalConditionController(mockMedicalConditionService);

    // Act
    await ctrl.updateMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(body));
  });

  it('should return 404 if medical condition update fails (unit test with stub)', async function () {
    // Arrange
    const body: IMedicalConditionDTO = {
      code: 'MC001',
      designation: 'Asthma',
      description: 'A condition where the airways constrict and swell.',
      commonSymptoms: 'Coughing, wheezing, shortness of breath'
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const mockMedicalConditionService = Container.get("MedicalConditionService") as IMedicalConditionService;
    (mockMedicalConditionService.updateMedicalCondition as sinon.SinonStub).returns(Result.fail<IMedicalConditionDTO>("Update failed"));

    const ctrl = new MedicalConditionController(mockMedicalConditionService);

    // Act
    await ctrl.updateMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ message: "Update failed" }));
  });

});
