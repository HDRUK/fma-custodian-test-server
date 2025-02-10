import { dataset } from '../types/dataset.interface';
import fs from 'fs';

export default class DatasetService {
    public async getDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        const datasets = [];

        const file = fs.readFileSync('./files/list.json', 'utf-8');
        const parsedJSON = JSON.parse(file);
        return parsedJSON;
    }

    public async getDataset(pid: string) {
        const file = fs.readFileSync('./files/dataset.json', 'utf-8');
        const parsedJSON = JSON.parse(file);

        return parsedJSON;
    }

    public async getDatasetCount() {
        const files = fs.readdirSync('./files');
        return files.length;
    }

    public async getExemplarDatasets(q: string, offset: number, limit: number): Promise<dataset[]> {
        const datasets = [];

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
