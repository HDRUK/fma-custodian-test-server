import Express from './api/v1/config/express';
import { Database } from './api/v1/config/database';

process.stdout.write('\x1B[2J\x1B[0f');

const initialiseApplication = async () => {
    await Database.init();
    await Express.init();
};

initialiseApplication();
