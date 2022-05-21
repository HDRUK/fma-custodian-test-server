import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import Locals from '../config/locals';
import AuthService from '../services/auth.service';
import { CredentialsModel } from '../models/credentials.model';

const authorise = (clientType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const auth: any = req.headers['authorization'];
        const apiKeyEncoded: any = req.headers['apikey'];
        let token, apiKey;

        try {
            if ((!auth && !apiKeyEncoded) || (auth && apiKeyEncoded)) {
                throw new Error();
            }

            if (auth) {
                if (auth.split(' ')[0] === 'Bearer') {
                    token = auth.split(' ')[1];
                } else {
                    throw new Error();
                }
            }

            if (apiKeyEncoded) {
                apiKey = Buffer.from(apiKeyEncoded, 'base64').toString('ascii');
            }
        } catch (err) {
            return res.status(401).send({
                status: 'Unauthorised',
                message: 'Authorization header must be EITHER { "Authorization": "Bearer <access_token>"} OR { "apikey": "<api_key>" }',
            });
        }

        try {
            if (token) {
                const decodedToken: any = jwt.verify(token, Locals.config().JWTSecret);

                if (clientType === 'admin') {
                    const client: any = await CredentialsModel.findOne({ _id: decodedToken.data.id });

                    if (client.clientType !== 'admin') {
                        throw new Error();
                    }
                }

                return next();
            }

            if (apiKey) {
                const client: any = await AuthService.authoriseKey(apiKey);

                if (clientType === 'admin') {
                    if (client.clientType !== 'admin') {
                        throw new Error();
                    }
                }

                return next();
            }

            throw new Error();
        } catch (err) {
            return res.status(401).send({
                status: 'Unauthorised',
                message: 'You are not authorised to access this endpoint',
            });
        }
    };
};

export default authorise;
