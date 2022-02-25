import { Request, Response } from 'express';

import { clientValidation } from './../index';

describe('MIDDLEWARE: clientValidation', () => {
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
    it('TEST: it should return 400 for a missing client_name', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.client_email = 'test@test.com';

        clientValidation(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should return 400 for a missing client_email', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.client_name = 'testName';

        clientValidation(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should return 400 for an invalid auth_type', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.client_name = 'testName';
        req.body.client_email = 'test@test.com';
        req.body.auth_type = 'notARealAuthType';

        clientValidation(req, res, nextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(nextFunction.mock.calls.length).toBe(0);
    });

    it('TEST: it should invoke next() for a valid client_name, client_email and auth_type', () => {
        let req = mockedRequest();
        let res = mockedResponse();
        const nextFunction = jest.fn();

        req.body.client_name = 'testName';
        req.body.client_email = 'test@test.com';
        req.body.auth_type = 'oauth';

        clientValidation(req, res, nextFunction);

        expect(nextFunction.mock.calls.length).toBe(1);
    });
});
