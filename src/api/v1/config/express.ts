import logger from 'morgan';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit';
import express, { Application, Request, Response } from 'express';

import Locals from './locals';

class Express {
    public express: express.Application;

    constructor() {
        this.express = <Application>express();
    }

    private mountRoutes(): void {
        this.express.use('/api/v1', require('../routes/dataset.route'));
        this.express.use('/oauth', require('../routes/oauth.route'));
        this.express.use('/admin', require('../routes/admin.route'));

        this.express.use((req: Request, res: Response) => {
            res.status(404).end('404 - not found');
        });
    }

    private initRateLimiting(): void {
        this.express.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 100,
                standardHeaders: true,
                legacyHeaders: false,
            }),
        );
    }

    public async init(): Promise<any> {
        const port: number = Locals.config().port;

        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use(logger('dev'));

        this.initRateLimiting();
        this.mountRoutes();

        this.express.listen(port, () => {
            process.stdout.write(`Service running @ 'http://localhost:${port}'\n`);
        });
    }
}

export default new Express();
