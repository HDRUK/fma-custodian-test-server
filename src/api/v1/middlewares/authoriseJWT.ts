import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import Locals from '../config/locals';
import { CredentialsModel } from '../models/credentials.model';

const authoriseJWT = (clientType: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        let token: any = req.headers['authorization'];

        if (token && token.split(' ')[0] === 'Bearer') {
            token = token.split(' ')[1];
        }

        try {
            const decodedToken: any = jwt.verify(token, Locals.config().JWTSecret);

            if (clientType === 'admin') {
                const client: any = await CredentialsModel.findOne({ _id: decodedToken.data.id });

                if (client.userType !== 'admin') {
                    throw new Error();
                }
            }

            next();
        } catch (err) {
            return res.status(401).send({
                status: 'Unauthorised',
                message: 'You are not authorised to access this endpoint',
            });
        }
    };
};

export default authoriseJWT;
