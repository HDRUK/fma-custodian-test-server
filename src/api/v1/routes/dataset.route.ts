import express, { Router } from 'express';

import { authorise, validateParams } from '../middlewares';
import DatasetService from '../services/dataset.service';
import DatasetController from '../controllers/dataset.controller';

const router: Router = express.Router();
const datasetService = new DatasetService();
const datasetController = new DatasetController(datasetService);

router.get('/datasets', authorise('user'), validateParams, datasetController.getDatasets);

router.get('/datasets/:id', authorise('user'), datasetController.getDataset);

module.exports = router;
