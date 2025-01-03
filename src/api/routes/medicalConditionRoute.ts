import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';

import config from "../../../config";
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
  app.use('/medicalConditions', route);

  const ctrl = Container.get(config.controllers.medicalCondition.name) as IMedicalConditionController;

  route.get('', middlewares.isAuth(["Admin", "Doctor"]), (req, res, next) => ctrl.getMedicalConditions(req, res, next) );

  route.post('', middlewares.isAuth(["Admin", "Doctor"]),
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        designation: Joi.string().required(),
        description: Joi.string().required(),
        commonSymptoms: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createMedicalCondition(req, res, next) );

  route.put('', middlewares.isAuth(["Admin", "Doctor"]),
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