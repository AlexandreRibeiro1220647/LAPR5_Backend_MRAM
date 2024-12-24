import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import allergy from './routes/allergyRoute';
import medicalCondition from './routes/medicalConditionRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);
	allergy(app);
	medicalCondition(app);
	
	return app
}