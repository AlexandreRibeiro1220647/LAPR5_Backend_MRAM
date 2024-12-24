import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from "../../../config";
import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';

const route = Router();

export default (app: Router) => {
  app.use('/medicalConditions', route);

  const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;

  route.get('', (req, res, next) => ctrl.getMedicalConditions(req, res, next) );

  route.post('',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        designation: Joi.string().required(),
        description: Joi.string().required(),
        commonSymptoms: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createMedicalCondition(req, res, next) );

  route.put('',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        designation: Joi.string().required(),
        description: Joi.string().required(),
        commonSymptoms: Joi.string().required()
      }),
    }),
    (req, res, next) => ctrl.updateMedicalCondition(req, res, next) );
};