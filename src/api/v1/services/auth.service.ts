import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Locals from '../config/locals';

export default class AuthService {
    public async verifyRefreshToken() {


        const accessToken = this.signToken({ id: 53, timeStamp: Date.now() }, 900);

        return accessToken;
    }

    public async verifyClientCredentials() {

        const account = {
            clientId: 532,
            _id : 1
        }

        if (!account) {
            throw new Error();
        }

        const accessToken = this.signToken({ id: account._id, timeStamp: Date.now() }, 900);
        const refreshToken = this.signToken({ id: account._id, timeStamp: Date.now() }, 64000);

        return [accessToken, refreshToken];
    }

  
    private signToken(account: any, expiresIn = 604800) {
        return jwt.sign({ data: account }, Locals.config().JWTSecret, {
            algorithm: 'HS256',
            expiresIn,
        });
    }
}
