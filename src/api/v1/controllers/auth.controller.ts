import { Request, Response } from 'express';

import AuthService from '../services/auth.service';

export default class AuthController {
    authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;

        this.generateToken = this.generateToken.bind(this);
        this.generateClientAccount = this.generateClientAccount.bind(this);
    }

    public async generateToken(req: Request, res: Response) {
        const { client_id, client_secret, refresh_token }: { client_id: string; client_secret: string; refresh_token: string } = req.body;

        try {
            if (refresh_token) {
                const accessToken = await this.authService.verifyRefreshToken(refresh_token);

                return res.status(200).send({
                    token_type: 'Bearer',
                    access_token: accessToken,
                    expires_in: 900,
                });
            }

            const [accessToken, refreshToken] = await this.authService.verifyClientCredentials(client_id, client_secret);

            return res.status(200).send({
                token_type: 'Bearer',
                access_token: accessToken,
                refresh_token: refreshToken,
                expires_in: 900,
            });
        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'OAuth2Error: invalid credentials',
            });
        }
    }

    public async generateClientAccount(req: Request, res: Response) {
        const { client_name, client_email }: { client_name: string; client_email: string } = req.body;
        try {
            let account;

            switch (req.body.auth_type) {
                case 'oauth':
                    account = await this.authService.generateClientCredentials(client_name, client_email);
                    break;
                case 'api_key':
                    account = await this.authService.generateAPIKey(client_name, client_email);
                    break;
            }

            return res.status(200).send({ status: 'success', account });
        } catch (err) {
            res.status(500).send({ status: 'error', message: (<Error>err).message });
        }
    }
}
