import mongoose from 'mongoose';

import DatasetService from '../dataset.service';
import { Database } from '../../config/database';

const database = new Database();

const datasetsStub = [
    {
        status: 'active',
        timestamps: {
            published: '2022-01-01T08:00:00.000+00:00',
            updated: '2022-01-01T08:00:00.000+00:00',
        },
        datasetv2: {
            identifier: 'testPersistentID_1',
            summary: {
                title: 'testDataset_1',
                publisher: {
                    name: 'testPublisher',
                },
            },
            documentation: {
                description: 'testDescription_1',
            },
            version: '1.0.0',
            issued: '2022-01-01T08:00:00.000+00:00',
            modified: '2022-01-01T08:00:00.000+00:00',
        },
    },
    {
        status: 'active',
        timestamps: {
            published: '2022-01-01T08:00:00.000+00:00',
            updated: '2022-01-01T08:00:00.000+00:00',
        },
        datasetv2: {
            identifier: 'testPersistentID_2',
            summary: {
                title: 'testDataset_2',
                publisher: {
                    name: 'testPublisher',
                },
            },
            documentation: {
                description: 'testDescription_2',
            },
            version: '1.0.0',
            issued: '2022-01-01T08:00:00.000+00:00',
            modified: '2022-01-01T08:00:00.000+00:00',
        },
    },
];

beforeAll(async () => {
    await database.inMemoryDbInitialise();
    await database.inMemoryDbLoad({ datasets: datasetsStub });
    await mongoose.connection.collection('datasets').createIndex({ 'datasetv2.summary.title': 'text' });
});

afterAll(async () => {
    await database.inMemoryDbClose();
});

describe('CLASS: datasetService', () => {
    const datasetService = new DatasetService();

    describe('METHOD: getDatasets', () => {
        it('TEST: it should return a correctly formatted array of datasets', async () => {
            const datasets = await datasetService.getDatasets('', 0, 0);

            const expectedResponse = [
                {
                    type: 'dataset',
                    identifier: 'testPersistentID_1',
                    name: 'testDataset_1',
                    description: 'testDescription_1',
                    version: '1.0.0',
                    issued: '2022-01-01T08:00:00.000+00:00',
                    modified: '2022-01-01T08:00:00.000+00:00',
                    source: 'testPublisher',
                },
                {
                    type: 'dataset',
                    identifier: 'testPersistentID_2',
                    name: 'testDataset_2',
                    description: 'testDescription_2',
                    version: '1.0.0',
                    issued: '2022-01-01T08:00:00.000+00:00',
                    modified: '2022-01-01T08:00:00.000+00:00',
                    source: 'testPublisher',
                },
            ];

            expect(datasets.length).toEqual(2);
            expect(datasets).toEqual(expectedResponse);
        });

        it('TEST: it should skip indexes correctly when offset > 0', async () => {
            const datasets = await datasetService.getDatasets('', 1, 0);

            const expectedResponse = [
                {
                    type: 'dataset',
                    identifier: 'testPersistentID_2',
                    name: 'testDataset_2',
                    description: 'testDescription_2',
                    version: '1.0.0',
                    issued: '2022-01-01T08:00:00.000+00:00',
                    modified: '2022-01-01T08:00:00.000+00:00',
                    source: 'testPublisher',
                },
            ];

            expect(datasets.length).toEqual(1);
            expect(datasets).toEqual(expectedResponse);
        });

        it('TEST: it should limit the number of results correctly when limit > 0', async () => {
            const datasets = await datasetService.getDatasets('', 0, 1);

            const expectedResponse = [
                {
                    type: 'dataset',
                    identifier: 'testPersistentID_1',
                    name: 'testDataset_1',
                    description: 'testDescription_1',
                    version: '1.0.0',
                    issued: '2022-01-01T08:00:00.000+00:00',
                    modified: '2022-01-01T08:00:00.000+00:00',
                    source: 'testPublisher',
                },
            ];

            expect(datasets.length).toEqual(1);
            expect(datasets).toEqual(expectedResponse);
        });

        it('TEST: it should return the appropriate result a query param is given', async () => {
            const datasets = await datasetService.getDatasets('testDataset_1', 0, 0);

            const expectedResponse = [
                {
                    type: 'dataset',
                    identifier: 'testPersistentID_1',
                    name: 'testDataset_1',
                    description: 'testDescription_1',
                    version: '1.0.0',
                    issued: '2022-01-01T08:00:00.000+00:00',
                    modified: '2022-01-01T08:00:00.000+00:00',
                    source: 'testPublisher',
                },
            ];

            expect(datasets.length).toEqual(1);
            expect(datasets).toEqual(expectedResponse);
        });
    });

    describe('METHOD: getDataset', () => {
        it('TEST: it should return the datasetv2 field of a single dataset', async () => {
            const dataset = await datasetService.getDataset('testPersistentID_1');

            const expectedResponse = {
                identifier: 'testPersistentID_1',
                summary: {
                    title: 'testDataset_1',
                    publisher: {
                        name: 'testPublisher',
                    },
                },
                documentation: {
                    description: 'testDescription_1',
                },
                version: '1.0.0',
                issued: '2022-01-01T08:00:00.000+00:00',
                modified: '2022-01-01T08:00:00.000+00:00',
            };

            expect(dataset.datasetv2).toEqual(expectedResponse);
        });
    });

    describe('METHOD: getDatasetCount', () => {
        it('TEST: it should return the correct total of active datasets', async () => {
            const count = await datasetService.getDatasetCount();

            const expectedResponse = 2;

            expect(count).toEqual(expectedResponse);
        });
    });
});
