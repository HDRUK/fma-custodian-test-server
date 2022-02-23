import * as path from 'path';
import * as dotenv from 'dotenv';

class Locals {
    public static config(): any {
        dotenv.config({ path: path.join(__dirname, '../../../../.env') });

        const mongoURL = process.env.MONGO_URL;
        const port = process.env.PORT;
        const JWTSecret = process.env.JWT_SECRET;

        return { mongoURL, port, JWTSecret };
    }
}

export default Locals;
