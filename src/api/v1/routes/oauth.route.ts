import express, { Router } from 'express';

import { generateToken } from '../utils/oauth';
import { oauthValidation } from '../middlewares/index';

const router: Router = express.Router();

router.post('/token', oauthValidation, generateToken);

export default router;
