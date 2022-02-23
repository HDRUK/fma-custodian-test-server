import express, { Router } from 'express';

import { verifyClient, generateClientCredentials } from '../utils/oauth';
import { oauthValidation, clientValidation, authoriseJWT } from '../middlewares/index';

const router: Router = express.Router();

router.post('/token', oauthValidation, verifyClient);

// Protected or admin-administered endpoint for example only
router.post('/register', authoriseJWT('admin'), clientValidation, generateClientCredentials);

module.exports = router;
