import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IAllergyController from '../../controllers/IControllers/IAllergyController'; 

import config from "../../../config";

const route = Router();

export default (app: Router) => {
  app.use('/allergies', route);

  const ctrl = Container.get(config.controllers.allergy.name) as IAllergyController;

  route.get('', (req, res, next) => ctrl.getAllergies(req, res, next) );

  route.post('',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        designation: Joi.string().required(),
        description: Joi.string().required()
      })
    }),
    (req, res, next) => ctrl.createAllergy(req, res, next) );

  route.put('',
    celebrate({
      body: Joi.object({
        code: Joi.string().required(),
        designation: Joi.string().required(),
        description: Joi.string().required()
      }),
    }),
    (req, res, next) => ctrl.updateAllergy(req, res, next) );
};