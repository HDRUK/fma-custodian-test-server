import { Schema } from 'mongoose';
import { Datasets } from '../models/dataset.model';

import { dataset } from '../types/dataset.interface';
export default class DatasetService {
    public async getDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        let pipeline: Array<any> = [
            {
                $match: {
                    ...(q && { $text: { $search: q } }),
                    status: 'active',
                },
            },
            { $skip: offset },
        ];

        if (limit) pipeline.push({ $limit: limit });

        const datasets = await Datasets.aggregate(pipeline).exec();

        let mappedDatasets: dataset[] = await datasets.map((dataset) => {
            return {
                '@schema': dataset.datasetv2['@schema'],
                type: 'dataset',
                identifier: dataset.datasetv2.identifier,
                name: dataset.datasetv2.summary.title,
                description: dataset.datasetv2.documentation.description,
                version: dataset.datasetv2.version,
                issued: dataset.datasetv2.issued,
                modified: dataset.datasetv2.modified,
                source: dataset.datasetv2.summary.publisher.name,
            };
        });

        return mappedDatasets;
    }

    public async getDataset(id: string) {
        const dataset = await Datasets.findOne({ 'datasetv2.identifier': id }).select('datasetv2').lean();

        return dataset;
    }

    public async getDatasetCount() {
        const count = await Datasets.count({ status: 'active' });

        return count;
    }
}
