import { Router } from 'express';
import { Container } from 'typedi';
import config from '../../../config';
import IMedicalRecordController from '../../controllers/IControllers/IMedicalRecordController';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/medicalRecords', route);

  const controller = Container.get(config.controllers.medicalRecord.name) as IMedicalRecordController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        patient: Joi.string().required(),
        allergies: Joi.array().required(),
        conditions: Joi.array().required(),
      }),
    }),
    (req, res, next) => controller.createMedicalRecord(req, res, next),
  );

  route.get('', (req, res, next) => controller.getMedicalRecords(req, res, next));

  route.put(
    '',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        patient: Joi.string().required(),
        allergies: Joi.array().required(),
        conditions: Joi.array().required(),
      }),
    }),
    (req, res, next) => controller.updateMedicalRecord(req, res, next),
  );
};