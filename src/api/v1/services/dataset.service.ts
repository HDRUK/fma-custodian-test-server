import { Datasets } from '../models/dataset.model';

import { dataset } from '../types/dataset.interface';

export default class DatasetService {
    public async getDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        const pipeline: Array<any> = [
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

        const mappedDatasets: dataset[] = await datasets.map((dataset) => {
            return {
                '@schema': dataset.schema,
                type: 'dataset',
                persistentId: dataset.persistentId,
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

    public async getDataset(pid: string) {
        const datasets = await Datasets.find({ persistentId: pid }).sort({ 'datasetv2.version': -1 }).select('datasetv2').lean();

        if (datasets.length > 0) {
            return datasets[0].datasetv2;
        }

        return;
    }

    public async getDatasetCount() {
        const count = await Datasets.count({ status: 'active' });

        return count;
    }
}
