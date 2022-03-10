import { Request, Response } from 'express';

import { oauthValidation } from './../index';

describe('MIDDLEWARE: oauthValidation', () => {
    const mockedRequest = () => {
        const req = <Request>{
            body: {},
        };
        return req;
    };

    const mockedResponse = () => {
        const res = <Response>{};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };
    it('TEST: it should return 400 for an invalid grant type', () => {
        const req = mockedRequest();
        const res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.grant_type = 'InvalidGrantType';

        oauthValidation(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should return 400 for a grant type but empty client_id', () => {
        const req = mockedRequest();
        const res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.grant_type = 'client_credentials';
        req.body.client_secret = 'testSecret';

        oauthValidation(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should return 400 for a grant type but empty client_secret', () => {
        const req = mockedRequest();
        const res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.grant_type = 'client_credentials';
        req.body.client_id = 'testID';

        oauthValidation(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should invoke next() for valid parameters', () => {
        const req = mockedRequest();
        const res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.grant_type = 'client_credentials';
        req.body.client_id = 'testID';
        req.body.client_secret = 'testSecret';

        oauthValidation(req, res, nextFunction);

        expect(nextFunction.mock.calls.length).toBe(1);
    });
});
