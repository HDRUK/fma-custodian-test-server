import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';

const oauthValidation = (req: Request, res: Response, next: NextFunction) => {
    const {
        client_id = '',
        client_secret = '',
        grant_type = '',
        refresh_token = '',
    }: { client_id: string; client_secret: string; grant_type: string; refresh_token: string } = req.body;

    if (!_.isEmpty(refresh_token)) {
        return next();
    }

    if (_.isEmpty(client_id) || _.isEmpty(client_secret) || _.isEmpty(grant_type)) {
        return res.status(400).send({
            status: 'error',
            message: 'OAuth2Error: incomplete credentials',
        });
    }

    switch (grant_type) {
        case 'client_credentials':
            return next();
        default:
            return res.status(400).send({
                status: 'error',
                message: 'OAuth2Error: only the client_credentials grant type is supported',
            });
    }
};

export default oauthValidation;
