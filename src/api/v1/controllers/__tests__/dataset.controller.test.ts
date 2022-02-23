import sinon from 'sinon';
import { Request, Response } from 'express';

import DatasetController from '../dataset.controller';
import DatasetService from '../../services/dataset.service';

import { dataset } from '../../types/dataset.interface';

afterEach(() => {
    sinon.restore();
});

describe('CLASS: DatasetController', () => {
    const datasetService = new DatasetService();
    const datasetController = new DatasetController(datasetService);

    const mockedRequest = () => {
        const req = <Request>{
            query: {},
            params: {},
        };
        return req;
    };

    const mockedResponse = () => {
        const res = <Response>{};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    describe('METHOD: getDatasets', () => {
        it('TEST: it should call the service function and return a 200 response if resolved', async () => {
            let getDatasetsStub = sinon.stub(datasetService, 'getDatasets').resolves([<dataset>{}]);

            let req = mockedRequest();
            let res = mockedResponse();

            await datasetController.getDatasets(req, res);

            expect(getDatasetsStub.calledOnce).toBe(true);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', datasets: [{}] });
        });

        it('TEST: it should call the service function and return a 500 response if rejected', async () => {
            let getDatasetsStub = sinon.stub(datasetService, 'getDatasets').rejects();

            let req = mockedRequest();
            let res = mockedResponse();

            await datasetController.getDatasets(req, res);

            expect(getDatasetsStub.calledOnce).toBe(true);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('METHOD: getDataset', () => {
        it('TEST: it should call the service function and return a 200 response if resolved', async () => {
            let getDatasetsStub = sinon.stub(datasetService, 'getDataset').returns(<any>{});

            let req = mockedRequest();
            let res = mockedResponse();

            await datasetController.getDataset(req, res);

            expect(getDatasetsStub.calledOnce).toBe(true);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ status: 'success', dataset: {} });
        });

        it('TEST: it should call the service function and return a 500 response if rejected', async () => {
            let getDatasetsStub = sinon.stub(datasetService, 'getDataset').rejects();

            let req = mockedRequest();
            let res = mockedResponse();

            await datasetController.getDataset(req, res);

            expect(getDatasetsStub.calledOnce).toBe(true);
            expect(res.status).toHaveBeenCalledWith(500);
        });
    });
});
