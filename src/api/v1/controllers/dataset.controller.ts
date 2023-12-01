import { Request, Response } from 'express';

import BaseController from './base.controller';
import DatasetService from '../services/dataset.service';

export default class DatasetController extends BaseController {
    datasetService: DatasetService;

    constructor(datasetService: DatasetService) {
        super();

        this.datasetService = datasetService;

        this.getDatasets = this.getDatasets.bind(this);
        this.getDataset = this.getDataset.bind(this);
    }

    public async getDatasets(req: Request, res: Response): Promise<any> {
        try {
            const { q = '', offset = '0', limit = '0'}: { q: string; offset: string; limit: string } = <any>req.query;

            const limitInt = parseInt(limit);
            const offsetInt = parseInt(offset);
            const datasets = await this.datasetService.getDatasets(q, offsetInt, limitInt);
            const datasetTotal = await this.datasetService.getDatasetCount();

            return res
                .status(200)
                .json({ query: { q: q || '', total: datasetTotal, limit: limitInt, offset: offsetInt }, items: datasets });
        } catch (err) {
            this._logger.sendDataInLogging({ data: err.name }, 'ERROR');
            this._logger.sendDataInLogging({ data: (<Error>err).message }, 'ERROR');
            return res.status(500).json({ status: 'error', message: (<Error>err).message });
        }
    }

    public async getDataset(req: Request, res: Response): Promise<any> {
        try {
            const pid: string = req.params.persistentId;
            const dataset: any = await this.datasetService.getDataset(pid);

            if (!dataset) {
                return res.status(404).json({ status: 'error', message: 'Dataset not found' });
            }

            return res.status(200).json(dataset);
        } catch (err) {
            this._logger.sendDataInLogging({ data: (<Error>err).message }, 'ERROR');
            return res.status(500).json({ status: 'error', message: (<Error>err).message });
        }
    }
}
