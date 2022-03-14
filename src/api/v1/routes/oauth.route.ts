import express, { Router } from 'express';

import AuthService from '../services/auth.service';
import { oauthValidation } from '../middlewares/index';
import AuthController from '../controllers/auth.controller';

const router: Router = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/token', oauthValidation, authController.generateToken);

export default router;
