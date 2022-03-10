import express, { Router, Request, Response } from 'express';

import { generateAPIKey } from '../utils/keys';
import { generateClientCredentials } from '../utils/oauth';
import { clientValidation, authorise } from '../middlewares/index';

const router: Router = express.Router();

// Protected or admin-administered endpoint for registering new clients with OAuth or an API key (GIVEN AS AN EXAMPLE ONLY)
router.post('/register', authorise('admin'), clientValidation, (req: Request, res: Response) => {
    switch (req.body.auth_type) {
        case 'oauth':
            generateClientCredentials(req, res);
            break;
        case 'api_key':
            generateAPIKey(req, res);
            break;
    }
});

export default router;
