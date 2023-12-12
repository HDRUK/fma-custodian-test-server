import { dataset } from '../types/dataset.interface';
import fs from 'fs';

export default class DatasetService {
    public async getDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        let datasets = [];

        const file = fs.readFileSync("./files/list.json", 'utf-8');
        const parsedJSON = JSON.parse(file);
        const datasetData = {
            persistentId : parsedJSON.identifier,
            "@schema" : parsedJSON["@schema"],
            version : parsedJSON.version,
            issued : parsedJSON.issued,
            modified : parsedJSON.modified,
            name : parsedJSON.summary.title,
            description : parsedJSON.summary.abstract,
            type : "dataset",
            source : parsedJSON.summary.publisher.name,
            self : "http://example-url.com/api/datasets/" + parsedJSON.identifier
        }

        datasets.push(datasetData);

        // Check the offset is valid
        if (offset < datasets.length)
        {
            datasets = datasets.slice(offset);
        }

        if (!isNaN(limit) && limit > 0)
        {
            datasets = datasets.slice(0, limit);
        }

        return datasets;
    }

    public async getDataset(pid: string) {
        const file = fs.readFileSync("./files/dataset.json", 'utf-8');
        const parsedJSON = JSON.parse(file);

        return parsedJSON;
    }

    public async getDatasetCount() {
        const files = fs.readdirSync("./files");
        return files.length;
    }
}
