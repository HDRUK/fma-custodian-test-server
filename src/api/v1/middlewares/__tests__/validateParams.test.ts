import { Request, Response } from 'express';

import { validateParams } from './../index';

describe('MIDDLEWARE: validateParams', () => {
    const mockedRequest = () => {
        const req = <Request>{
            query: {},
        };
        return req;
    };

    const mockedResponse = () => {
        const res = <Response>{};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };
    it('TEST: it should return 400 for an invalid offset', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.query = {
            offset: '-1',
        };

        validateParams(req, res, nextFunction);

        const expectedResponse = {
            status: 'error',
            message: 'The offset parameter must be an integer >= 0',
        };

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expectedResponse);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should return 400 for an invalid limit', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.query = {
            limit: '-1',
        };

        validateParams(req, res, nextFunction);

        const expectedResponse = {
            status: 'error',
            message: 'The limit parameter must be an integer > 0',
        };

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith(expectedResponse);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should invoke next when all query params are valid', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.query = {
            q: '',
            offset: '1',
            limit: '1',
        };

        validateParams(req, res, nextFunction);

        expect(nextFunction.mock.calls.length).toBe(1);
    });

    it('TEST: it should escape certain character from the query (q) param', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.query = {
            q: 'this@SymbolShouldBeRemoved{}',
        };

        validateParams(req, res, nextFunction);

        expect(req.query.q).toEqual('thisSymbolShouldBeRemoved');
        expect(nextFunction.mock.calls.length).toBe(1);
    });
});
