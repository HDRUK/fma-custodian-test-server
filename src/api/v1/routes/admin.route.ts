import express, { Router } from 'express';

import AuthService from '../services/auth.service';
import AuthController from '../controllers/auth.controller';
import { clientValidation, authorise } from '../middlewares/index';

const router: Router = express.Router();

const authService = new AuthService();
const authController = new AuthController(authService);

// Protected or admin-administered endpoint for registering new clients with OAuth or an API key (GIVEN AS AN EXAMPLE ONLY)
router.post('/register', authorise('admin'), clientValidation, authController.generateClientAccount);

export default router;
