import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import Locals from '../config/locals';
import { authoriseKey } from '../utils/keys';
import { CredentialsModel } from '../models/credentials.model';

const authorise = (clientType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let auth: any = req.headers['authorization'];

        let token, apiKey;
        if (auth && auth.split(' ')[0] === 'Bearer') {
            token = auth.split(' ')[1];
        } else if (auth && auth.split(' ')[0] === 'Basic'! && auth.split(' ')[1].split(':').length === 2) {
            apiKey = auth.split(' ')[1];
        } else {
            return res.status(401).send({
                status: 'Unauthorised',
                message: 'The authorization header value must be of the format "Basic <client_id>:<api_key>" or "Bearer <access_token>"',
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
                const client: any = await authoriseKey(apiKey);

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
