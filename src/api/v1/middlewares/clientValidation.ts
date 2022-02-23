import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';

const clientValidation = (req: Request, res: Response, next: NextFunction) => {
    const { client_name = '', client_email = '' }: { client_name: string; client_email: string } = req.body;

    if (_.isEmpty(client_name) || _.isEmpty(client_email)) {
        return res.status(400).send({
            status: 'error',
            message: 'The client_name and/or client_email parameters are missing from the request',
        });
    }

    next();
};

export default clientValidation;
