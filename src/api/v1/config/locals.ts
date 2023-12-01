import * as path from 'path';
import * as dotenv from 'dotenv';

class Locals {
    public static config(): any {
        dotenv.config({ path: path.join(__dirname, '../../../../.env') });

        const port = process.env.PORT;
        const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DATABASE}?ssl=true&retryWrites=true`;
        const JWTSecret = process.env.JWT_SECRET;
        const googleProjectId = process.env.LOGGING_PROJECT_ID;
        const googleLoggingName = process.env.LOGGING_LOG_NAME;
        const loggingType = process.env.LOGGING_TYPE;

        return { mongoURI, port, JWTSecret, googleProjectId, googleLoggingName, loggingType };
    }
}

export default Locals;
