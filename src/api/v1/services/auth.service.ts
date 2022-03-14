import _ from 'lodash';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Locals from '../config/locals';
import { TokenModel } from '../models/token.model';
import { CredentialsModel } from '../models/credentials.model';

export default class AuthService {
    public async generateClientCredentials(clientName: string, clientEmail: string) {
        const clientSecret = crypto.randomBytes(50).toString('hex').substring(50);

        const hashedClientSecret = await bcrypt.hash(clientSecret, 10);

        const existingAccount = await CredentialsModel.findOne({ clientName }).lean();

        let account;
        if (existingAccount) {
            account = await CredentialsModel.findOneAndUpdate({ _id: existingAccount._id }, { clientSecret: hashedClientSecret });
        } else {
            account = await CredentialsModel.create({
                clientId: crypto.randomBytes(15).toString('hex').substring(15),
                clientSecret: hashedClientSecret,
                clientName: clientName,
                clientEmail: clientEmail,
            });
        }

        if (!account) {
            throw new Error('Error generating or updating client account');
        }

        const credentials = {
            clientId: account.clientId,
            clientSecret: clientSecret,
            clientName: clientName,
            clientEmail: clientEmail,
            clientType: account.clientType,
        };

        return credentials;
    }

    public async verifyRefreshToken(refreshToken: string) {
        const token: any = TokenModel.findOne({ token: refreshToken });

        if (!token) {
            throw new Error();
        }

        const accessToken = this.signToken({ id: token.client, timeStamp: Date.now() }, 900);

        return accessToken;
    }

    public async verifyClientCredentials(clientId, clientSecret) {
        const account = await this.authorizeAccount(clientId, clientSecret);

        if (!account) {
            throw new Error();
        }

        const accessToken = this.signToken({ id: account._id, timeStamp: Date.now() }, 900);
        const refreshToken = this.signToken({ id: account._id, timeStamp: Date.now() }, 64000);

        await TokenModel.deleteMany({ client: clientId });

        await new TokenModel({
            clientId: account.clientId,
            token: refreshToken,
            createdAt: Date.now(),
        }).save();

        return [accessToken, refreshToken];
    }

    public async generateAPIKey(clientName: string, clientEmail: string) {
        const APIKey = crypto.randomBytes(40).toString('hex').substring(40);

        const hashedAPIKey = await bcrypt.hash(APIKey, 10);

        const existingAccount = await CredentialsModel.findOne({ clientName }).lean();

        let account;
        if (existingAccount) {
            account = await CredentialsModel.findByIdAndUpdate({ _id: existingAccount._id }, { apiKey: hashedAPIKey });
        } else {
            account = await CredentialsModel.create({
                apiKey: hashedAPIKey,
                clientId: crypto.randomBytes(15).toString('hex').substring(15),
                clientName: clientName,
                clientEmail: clientEmail,
            });
        }

        if (!account) {
            throw new Error('Error generating or updating client account');
        }

        const credentials = {
            clientId: account.clientId,
            apiKey: APIKey,
            clientName: clientName,
            clientEmail: clientEmail,
            clientType: account.clientType,
        };

        return credentials;
    }

    public static async authoriseKey(apiKey: string) {
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
    }

    private async authorizeAccount(clientId: string, clientSecret: string) {
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
    }

    private signToken(account: any, expiresIn: number = 604800) {
        return jwt.sign({ data: account }, Locals.config().JWTSecret, {
            algorithm: 'HS256',
            expiresIn,
        });
    }
}
