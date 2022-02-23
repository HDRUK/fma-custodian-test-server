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
            const datasets = await this.datasetService.getDatasets();

            return res.status(200).json({ status: 'success', datasets: datasets });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: (<Error>err).message });
        }
    }

    public async getDataset(req: Request, res: Response): Promise<any> {
        try {
            const id: string = req.params.id;
            const dataset: any = await this.datasetService.getDataset(id);

            return res.status(200).json({ status: 'success', dataset });
        } catch (err) {
            return res.status(500).json({ status: 'error', message: (<Error>err).message });
        }
    }
}
