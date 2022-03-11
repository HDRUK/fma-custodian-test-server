import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Locals from './locals';

export class Database {
    mongod: any;

    public static async init(): Promise<any> {
        const uri = Locals.config().mongoURI;

        try {
            await mongoose.connect(uri);
            process.stdout.write('Connected to database\n');
        } catch (err) {
            process.stdout.write('Error connecting to database\n');
            process.stdout.write((<Error>err).message + '\n');
            process.exit(1);
        }
    }

    public inMemoryDbInitialise = async () => {
        this.mongod = await MongoMemoryServer.create();
        const uri = await this.mongod.getUri();

        const mongooseOptions = <any>{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(uri, mongooseOptions);
    };

    public inMemoryDbLoad = (data: { [key: string]: any }) => {
        const upload = Object.keys(data).map((key: string) => {
            const collection = mongoose.connection.collection(key);
            return collection.insertMany(data[key]);
        });
        return Promise.all(upload);
    };

    public inMemoryDbClose = async (): Promise<void> => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close(true);
        await this.mongod.stop();
    };
}

export default mongoose;
