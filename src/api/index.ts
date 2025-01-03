import { Router } from 'express';
import allergy from './routes/allergyRoute';
import medicalCondition from './routes/medicalConditionRoute';

export default () => {
	const app = Router();

	allergy(app);
	medicalCondition(app);
	
	return app
}