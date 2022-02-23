import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';

const oauthValidation = (req: Request, res: Response, next: NextFunction) => {
    const { grant_type = '' }: { grant_type: string } = req.body;

    if (grant_type === 'client_credentials') {
        const { client_id = '', client_secret = '' }: { client_id: string; client_secret: string } = req.body;

        if (_.isEmpty(client_id) || _.isEmpty(client_secret)) {
            return res.status(400).send({
                status: 'error',
                message: 'OAuth2Error: incomplete credentials',
            });
        }

        next();
    } else {
        return res.status(400).send({
            status: 'error',
            message: 'OAuth2Error: only the client_credentials grant type is supported',
        });
    }
};

export default oauthValidation;
