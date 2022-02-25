import express, { Router } from 'express';

import { authoriseJWT, validateParams } from '../middlewares';
import DatasetService from '../services/dataset.service';
import DatasetController from '../controllers/dataset.controller';

const router: Router = express.Router();
const datasetService = new DatasetService();
const datasetController = new DatasetController(datasetService);

router.get('/datasets', authoriseJWT('user'), validateParams, datasetController.getDatasets);

router.get('/datasets/:id', authoriseJWT('user'), datasetController.getDataset);

module.exports = router;
