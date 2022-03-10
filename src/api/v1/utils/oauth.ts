import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Locals from '../config/locals';
import { Request, Response } from 'express';
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

        return res.status(200).send({ status: 'success', account });
    } catch (err) {
        res.status(500).send({ status: 'error', message: (<Error>err).message });
    }
};

export const verifyClient: any = async (req: Request, res: Response) => {
    const { client_id, client_secret }: { client_id: string; client_secret: string } = req.body;

    const account = await authorizeAccount(client_id, client_secret);

    if (!account) {
        return res.status(400).send({
            status: 'error',
            message: 'OAuth2Error: invalid credentials',
        });
    }

    const jwt = signToken({ id: account.id, timeStamp: Date.now() }, 900);
    const access_token = `Bearer ${jwt}`;

    return res.status(200).send({
        token_type: 'jwt',
        access_token,
        expires_in: 900,
    });
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
