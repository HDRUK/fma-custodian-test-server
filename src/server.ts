import logger from 'morgan';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit';
import express, { Application, Request, Response } from 'express';

import Locals from './api/v1/config/locals';
import { Database } from './api/v1/config/database';
import oauthRoutes from './api/v1/routes/oauth.route';
import adminRoutes from './api/v1/routes/admin.route';
import datasetRoutes from './api/v1/routes/dataset.route';

const initApplication = async () => {
    process.stdout.write('\x1B[2J\x1B[0f');

    const app: Application = express();
    const port: number = Locals.config().port;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(logger('dev'));

    app.use('/oauth', oauthRoutes);
    app.use('/admin', adminRoutes);
    app.use('/api/v1', datasetRoutes);

    app.use((_req: Request, res: Response) => {
        res.status(404).end('404 - not found');
    });

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false,
        }),
    );

    await Database.init();

    app.listen(port, () => {
        process.stdout.write(`Service running @ 'http://localhost:${port}'\n`);
    });
};

initApplication();
