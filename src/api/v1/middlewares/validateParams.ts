import { Request, Response, NextFunction } from 'express';

const validateParams = (req: Request, res: Response, next: NextFunction) => {
    const { q = '', offset, limit }: { q: string; offset: string; limit: string } = <any>req.query;

    if (offset)
        if (parseInt(offset) < 0 || (!parseInt(offset) && offset !== '0')) {
            return res.status(400).send({
                status: 'error',
                message: 'The offset parameter must be an integer >= 0',
            });
        }

    if (limit)
        if (parseInt(limit) < 0 || !parseInt(limit)) {
            return res.status(400).send({
                status: 'error',
                message: 'The limit parameter must be an integer > 0',
            });
        }

    req.query = {
        q: q.replace(/["@.*+/?^${}()|[\]\\]/g, ''),
        offset: offset,
        limit: limit,
    };

    next();
};

export default validateParams;
