import express, { Router } from 'express';

import { verifyClient } from '../utils/oauth';
import { oauthValidation } from '../middlewares/index';

const router: Router = express.Router();

router.post('/token', oauthValidation, verifyClient);

export default router;
