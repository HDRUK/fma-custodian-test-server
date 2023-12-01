import { dataset } from '../types/dataset.interface';
import fs from 'fs';

export default class DatasetService {
    public async getDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        // The files directory contains a set of example JSON files
        const files = fs.readdirSync("./files");
        let datasets = [];

        for (let i = 0; i < files.length; i++)
        {
            const file = fs.readFileSync("./files/" + files[i], 'utf-8');
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

            // If the search query isn't blank
            if (q != '')
            {
                // If the query can be found in the description
                if (parsedJSON.summary.abstract.search(q) != -1)
                {
                    datasets.push(datasetData);
                }
            }
            else
            {
                datasets.push(datasetData);
            }
        }

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

        // The files directory contains a set of example JSON files
        const files = fs.readdirSync("./files");

        for (let i = 0; i < files.length; i++)
        {
            const file = fs.readFileSync("./files/" + files[i], 'utf-8');
            const parsedJSON = JSON.parse(file);

            // This is the dataset the user is looking for
            if (parsedJSON.identifier == pid)
            {
                return {
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
            }

        }
        return;
    }

    public async getDatasetCount() {
        const files = fs.readdirSync("./files");
        return files.length;
    }
}
