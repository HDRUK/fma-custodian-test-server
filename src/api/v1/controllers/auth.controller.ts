import { Request, Response } from 'express';

import BaseController from './base.controller';
import AuthService from '../services/auth.service';

export default class AuthController extends BaseController {
    authService: AuthService;

    constructor(authService: AuthService) {
        super();

        this.authService = authService;

        this.generateToken = this.generateToken.bind(this);
    }

    public async generateToken(req: Request, res: Response) {
        const { refresh_token }: { client_id: string; client_secret: string; refresh_token: string } = req.body;

        try {
            if (refresh_token) {
                const accessToken = await this.authService.verifyRefreshToken();

                return res.status(200).send({
                    token_type: 'Bearer',
                    access_token: accessToken,
                    expires_in: 900,
                });
            }

            const [accessToken, refreshToken] = await this.authService.verifyClientCredentials();

            return res.status(200).send({
                token_type: 'Bearer',
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: 900,
            });
        } catch (err) {
            this._logger.sendDataInLogging({ data: 'OAuth2Error: invalid credentials' }, 'INFO');
            return res.status(400).send({
                status: 'error',
                message: 'OAuth2Error: invalid credentials',
            });
        }
    }

}
