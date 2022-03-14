import _ from 'lodash';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Locals from '../config/locals';
import { Request, Response } from 'express';
import { TokenModel } from '../models/token.model';
import { CredentialsModel } from '../models/credentials.model';

export const generateClientCredentials = async (req: Request, res: Response): Promise<any> => {
    try {
        const { client_name = '', client_email = '' }: { client_name: string; client_email: string } = req.body;

        const clientSecret = crypto.randomBytes(50).toString('hex').substring(50);

        const hashedClientSecret = await bcrypt.hash(clientSecret, 10);

        const existingAccount = await CredentialsModel.findOne({ clientName: client_name }).lean();

        let account;
        if (existingAccount) {
            account = await CredentialsModel.findOneAndUpdate({ _id: existingAccount._id }, { clientSecret: hashedClientSecret });
        } else {
            account = await CredentialsModel.create({
                clientId: crypto.randomBytes(15).toString('hex').substring(15),
                clientSecret: hashedClientSecret,
                clientName: client_name,
                clientEmail: client_email,
            });
        }

        if (!account) {
            throw new Error('Error generating or updating client account');
        }

        account.clientSecret = clientSecret;

        account.apiKey = undefined;

        return res.status(200).send({ status: 'success', account });
    } catch (err) {
        res.status(500).send({ status: 'error', message: (<Error>err).message });
    }
};

export const generateToken: any = async (req: Request, res: Response) => {
    const { client_id, client_secret, refresh_token }: { client_id: string; client_secret: string; refresh_token: string } = req.body;

    try {
        if (refresh_token) {
            const accessToken = await verifyRefreshToken(refresh_token);

            return res.status(200).send({
                token_type: 'Bearer',
                access_token: accessToken,
                expires_in: 900,
            });
        }

        const [accessToken, refreshToken] = await verifyClientCredentials(client_id, client_secret);

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
};

const verifyRefreshToken: any = async (refreshToken: string) => {
    const token: any = TokenModel.findOne({ token: refreshToken });

    if (!token) {
        throw new Error();
    }

    const accessToken = signToken({ id: token.client, timeStamp: Date.now() }, 900);

    return accessToken;
};

const verifyClientCredentials: any = async (clientId: string, clientSecret: string) => {
    const account = await authorizeAccount(clientId, clientSecret);

    if (!account) {
        throw new Error();
    }

    const accessToken = signToken({ id: account._id, timeStamp: Date.now() }, 900);
    const refreshToken = signToken({ id: account._id, timeStamp: Date.now() }, 64000);

    await TokenModel.remove({ client: clientId });

    await new TokenModel({
        client: account.clientId,
        token: refreshToken,
        createdAt: Date.now(),
    }).save();

    return [accessToken, refreshToken];
};

const authorizeAccount: any = async (clientId: string, clientSecret: string) => {
    const account = await CredentialsModel.findOne({ clientId: clientId });

    if (!account) {
        return;
    }

    const { clientSecret: hashedClientSecret = '' } = account;

    const match = await bcrypt.compare(clientSecret, hashedClientSecret);

    if (match) {
        return account;
    }

    return;
};

const signToken = (account: any, expiresIn = 604800) => {
    return jwt.sign({ data: account }, Locals.config().JWTSecret, {
        algorithm: 'HS256',
        expiresIn,
    });
};
