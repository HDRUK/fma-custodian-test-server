import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { CredentialsModel } from '../models/credentials.model';

export const generateAPIKey = async (req: Request, res: Response): Promise<any> => {
    try {
        const { client_name = '', client_email = '' }: { client_name: string; client_email: string } = req.body;

        const APIKey = crypto.randomBytes(40).toString('hex').substring(40);

        const hashedAPIKey = await bcrypt.hash(APIKey, 10);

        const existingAccount = await CredentialsModel.findOne({ clientName: client_name }).lean();

        let account;
        if (existingAccount) {
            account = await CredentialsModel.findByIdAndUpdate({ _id: existingAccount._id }, { apiKey: hashedAPIKey });
        } else {
            account = await CredentialsModel.create({
                apiKey: hashedAPIKey,
                clientId: crypto.randomBytes(15).toString('hex').substring(15),
                clientName: client_name,
                clientEmail: client_email,
            });
        }

        if (!account) {
            throw new Error('Error generating or updating client account');
        }

        account.apiKey = APIKey;

        return res.status(200).send({ status: 'success', account });
    } catch (err) {
        res.status(500).send({ status: 'error', message: (<Error>err).message });
    }
};

export const authoriseKey = async (apiKey: string) => {
    const clientId = apiKey.split(':')[0];
    const key = apiKey.split(':')[1];

    const account = await CredentialsModel.findOne({ clientId: clientId });

    if (!account) {
        throw new Error();
    }

    const match = await bcrypt.compare(key, account.apiKey);

    if (!match) {
        throw new Error();
    }

    return account;
};
