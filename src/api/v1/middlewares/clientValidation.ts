import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';

const clientValidation = (req: Request, res: Response, next: NextFunction) => {
    const {
        auth_type = '',
        client_name = '',
        client_email = '',
    }: { auth_type: string; client_name: string; client_email: string } = req.body;

    if (!['api_key', 'oauth'].includes(auth_type)) {
        return res.status(400).send({
            status: 'error',
            message: 'The auth_type parameter must be one of ["api_key", "oauth"]',
        });
    }

    if (_.isEmpty(client_name) || _.isEmpty(client_email)) {
        return res.status(400).send({
            status: 'error',
            message: 'The client_name and/or client_email parameters are missing from the request',
        });
    }

    next();
};

export default clientValidation;
