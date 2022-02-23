import { Datasets } from '../models/datasest.model';

import { dataset } from '../types/dataset.interface';
export default class DatasetService {
    public async getDatasets(): Promise<dataset[]> {
        const datasets = await Datasets.find({
            status: 'active',
        })
            .select('datasetv2')
            .lean();

        let mappedDatasets: dataset[] = await datasets.map((dataset) => {
            return {
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
}
