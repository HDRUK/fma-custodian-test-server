import express, { Router } from 'express';

import { verifyClient, generateClientCredentials } from '../utils/oauth';
import { oauthValidation, clientValidation, authorise } from '../middlewares/index';

const router: Router = express.Router();

router.post('/token', oauthValidation, verifyClient);

module.exports = router;
