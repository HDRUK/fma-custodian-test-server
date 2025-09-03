import { dataset } from '../types/dataset.interface';
import fs from 'fs';

export default class DatasetService {
    public async getDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        const file = fs.readFileSync('./files/list.json', 'utf-8');
        const parsedJSON = JSON.parse(file);
        return parsedJSON;
    }

    public async getDataset(pid: string) {
                
        const githubResponse = await fetch(
            "https://raw.githubusercontent.com/HDRUK/schemata/dev/docs/HDRUK/4.0.0.example.json"
        );
        const githubJSON = await githubResponse.json();


        return githubJSON;
    }

    public async getDatasetCount() {
        const files = fs.readdirSync('./files');
        return files.length;
    }

    public async getExemplarDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        const file = fs.readFileSync('./files/mdw/list.json', 'utf-8');
        const parsedJSON = JSON.parse(file);

        return parsedJSON;
    }

    public async getExemplarDataset(pid: string) {
        const file = fs.readFileSync(`./files/mdw/${pid}.json`, 'utf-8');
        const parsedJSON = JSON.parse(file);

        return parsedJSON;
    }

    public async getExemplarDatasetCount() {
        const files = fs.readdirSync('./files');
        return files.length;
    }
}
