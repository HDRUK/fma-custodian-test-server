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
            identifier: 'testPersistentID',
            summary: {
                title: 'testDataset',
                publisher: {
                    name: 'testPublisher',
                },
            },
            documentation: {
                description: 'testDescription',
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
});

afterAll(async () => {
    await database.inMemoryDbClose();
});

describe('CLASS: datasetService', () => {
    const datasetService = new DatasetService();

    describe('METHOD: getDatasets', () => {
        it('TEST: it should return a correctly formatted array of datasets', async () => {
            const datasets = await datasetService.getDatasets();

            const expectedResponse = [
                {
                    type: 'dataset',
                    identifier: 'testPersistentID',
                    name: 'testDataset',
                    description: 'testDescription',
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
            const dataset = await datasetService.getDataset('testPersistentID');

            const expectedResponse = {
                identifier: 'testPersistentID',
                summary: {
                    title: 'testDataset',
                    publisher: {
                        name: 'testPublisher',
                    },
                },
                documentation: {
                    description: 'testDescription',
                },
                version: '1.0.0',
                issued: '2022-01-01T08:00:00.000+00:00',
                modified: '2022-01-01T08:00:00.000+00:00',
            };

            expect(dataset.datasetv2).toEqual(expectedResponse);
        });
    });
});
