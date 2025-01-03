import 'reflect-metadata';
import * as sinon from 'sinon';
import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import AllergyController from '../src/controllers/allergyController';
import IAllergyService from '../src/services/IServices/IAllergyService';
import { Result } from '../src/core/logic/Result';
import AllergyRepo from '../src/repos/allergyRepo'; // Ensure you import AllergyRepo
import { IAllergyDTO } from '../src/dto/IAllergyDTO';
import { Model } from 'mongoose'; // Importing Model for mongoose type

// Mocking the dependencies
const mockAllergySchema: Partial<Model<any>> = {}; // Mock allergy schema
const mockLogger = { log: sinon.spy() }; // Mock logger

describe('Allergy Controller', function () {
  const sandbox = sinon.createSandbox();

  beforeEach(function () {
	sandbox.restore();  // Reset any previous stubs, spies, or mocks before each test
	Container.reset();
  
	// Explicitly set the repository in the container
	const allergyRepoInstance = new AllergyRepo(mockAllergySchema as Model<any>, mockLogger);
	Container.set('AllergyRepo', allergyRepoInstance); // Register it with the container
  
	// Create the service and inject the repo into it
	const allergyServiceInstance = new (require('../src/services/AllergyService').default)(allergyRepoInstance);
	// Avoid stubbing here directly, we do it later in individual tests
	Container.set('AllergyService', allergyServiceInstance);
});

  afterEach(function () {
	sandbox.restore();
});

  it('should create an allergy successfully (unit test with stub)', async function () {
    // Arrange
    const body = { code: 'ALRGY001', designation: 'Pollen', description: 'Pollen allergy' };
    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy() };
    const next: Partial<NextFunction> = () => {};

    let allergyServiceInstance = Container.get("AllergyService");
    sinon.stub(allergyServiceInstance, "createAllergy").returns(Result.ok<IAllergyDTO>({
      code: body.code,
      designation: body.designation,
      description: body.description
    }));

    const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);

    // Act
    await ctrl.createAllergy(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({
      code: body.code,
      designation: body.designation,
      description: body.description
    }));
  });

  it('should return 404 if allergy creation fails (unit test with stub)', async function () {
	// Arrange
	const body = { code: 'ALRGY001', designation: 'Pollen', description: 'Pollen allergy' };
	const req: Partial<Request> = { body };
  
	// Mocking response object with spies
	const res: Partial<Response> = { 
	  json: sinon.spy(),
	  status: sinon.stub().returnsThis()  // Ensure status is correctly chained
	};
	const next: Partial<NextFunction> = () => {};
  
	const allergyServiceInstance = Container.get("AllergyService");
  
	// Simulate failure in service method
	sinon.stub(allergyServiceInstance, "createAllergy").returns(Result.fail<IAllergyDTO>("Creation failed"));
  
	const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);
  
	// Act
	await ctrl.createAllergy(<Request>req, <Response>res, <NextFunction>next);
  
	// Assert
	sinon.assert.calledOnce(res.status);  // Ensure status is called once
	sinon.assert.calledWith(res.status, 404);  // Ensure it was called with 404 status
  
	sinon.assert.calledOnce(res.json);  // Ensure json is called
	sinon.assert.calledWith(res.json, sinon.match({ message: "Creation failed" }));  // Check if message matches
  });
  
  it('should return all allergies successfully (integration test with stub)', async function () {
	const allergies = [{ code: 'ALRGY001', designation: 'Pollen', description: 'Pollen allergy' }];
	const req: Partial<Request> = {};
	const res: Partial<Response> = {
	  json: sinon.spy(),
	  status: sinon.stub().returnsThis(), // Ensure status returns this for chaining
	};
	const next: Partial<NextFunction> = () => {};
  
	let allergyServiceInstance = Container.get("AllergyService");
  
	const stubbedGetAllergies = sinon.stub(allergyServiceInstance, "getAllergies").returns(Result.ok(allergies));
  
	const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);
  
	await ctrl.getAllergies(<Request>req, <Response>res, <NextFunction>next);
  
	sinon.assert.calledOnce(res.json);
	sinon.assert.calledWith(res.json, sinon.match.array.deepEquals(allergies));
	sinon.assert.calledOnce(stubbedGetAllergies);
  });
  
  

  it('should return 404 if no allergies found (integration test with spy)', async function () {
    // Arrange
    const req: Partial<Request> = {};
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    let allergyServiceInstance = Container.get("AllergyService");
    sinon.stub(allergyServiceInstance, "getAllergies").returns(Result.fail<IAllergyDTO[]>("No allergies found"));

    const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);

    // Act
    await ctrl.getAllergies(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
  });
  
  it('should update allergy successfully (unit test with stub)', async function () {
	const body = { code: 'ALRGY001', designation: 'Pollen', description: 'Pollen allergy' };
	const req: Partial<Request> = { body };
	const res: Partial<Response> = {
	  json: sinon.spy(),
	  status: sinon.stub().returnsThis(), // Ensure status returns this for chaining
	};
	const next: Partial<NextFunction> = () => {};
  
	const allergyServiceInstance = Container.get("AllergyService");
  
	sinon.stub(allergyServiceInstance, "updateAllergy").returns(Result.ok<IAllergyDTO>({
	  code: body.code,
	  designation: body.designation,
	  description: body.description
	}));
  
	const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);
  
	await ctrl.updateAllergy(<Request>req, <Response>res, <NextFunction>next);
  
	sinon.assert.calledOnce(res.json);
	sinon.assert.calledWith(res.json, sinon.match({
	  code: body.code,
	  designation: body.designation,
	  description: body.description
	}));
  });
  
  it('should return 404 if allergy update fails (unit test with stub)', async function () {
	const body = { code: 'ALRGY001', designation: 'Pollen', description: 'Pollen allergy' };
	const req: Partial<Request> = { body };
	const res: Partial<Response> = {
	  json: sinon.spy(),
	  status: sinon.stub().returnsThis(), // Ensure status returns this for chaining
	};
	const next: Partial<NextFunction> = () => {};
  
	const allergyServiceInstance = Container.get("AllergyService");
  
	sinon.stub(allergyServiceInstance, "updateAllergy").returns(Result.fail<IAllergyDTO>("Update failed"));
  
	const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);
  
	await ctrl.updateAllergy(<Request>req, <Response>res, <NextFunction>next);
  
	sinon.assert.calledOnce(res.json);  // Ensure json is called
	sinon.assert.calledWith(res.json, sinon.match({ message: "Update failed" }));
  });
  
});
