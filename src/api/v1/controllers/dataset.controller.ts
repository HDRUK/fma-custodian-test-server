import { Request, Response } from 'express';

import DatasetService from '../services/dataset.service';

export default class DatasetController {
    datasetService: DatasetService;

    constructor(datasetService: DatasetService) {
        this.datasetService = datasetService;

        this.getDatasets = this.getDatasets.bind(this);
        this.getDataset = this.getDataset.bind(this);
    }

    public async getDatasets(req: Request, res: Response): Promise<any> {
        try {
            const { q = '', offset = '0', limit }: { q: string; offset: string; limit: string } = <any>req.query;

            const datasets = await this.datasetService.getDatasets(q, parseInt(offset), parseInt(limit));
            const datasetTotal = await this.datasetService.getDatasetCount();

            return res
                .status(200)
                .json({ query: { q: q || '', total: String(datasetTotal), limit: limit || '', offset: offset }, items: datasets });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: (<Error>err).message });
        }
    }

    public async getDataset(req: Request, res: Response): Promise<any> {
        try {
            const id: string = req.params.id;
            const dataset: any = await this.datasetService.getDataset(id);

            return res.status(200).json(dataset);
        } catch (err) {
            return res.status(500).json({ status: 'error', message: (<Error>err).message });
        }
    }
}
