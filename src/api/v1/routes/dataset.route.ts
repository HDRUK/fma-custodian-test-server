import express, { Router } from 'express';

import DatasetService from '../services/dataset.service';
import { authorise, validateParams } from '../middlewares';
import DatasetController from '../controllers/dataset.controller';

const router: Router = express.Router();

const datasetService = new DatasetService();
const datasetController = new DatasetController(datasetService);

// No authorisation
router.get('/noauth/datasets', validateParams, datasetController.getDatasets);
router.get('/noauth/datasets/:persistentId', datasetController.getDataset);

// Protected endpoints - API key or OAuth access token
router.get('/datasets', authorise('user'), validateParams, datasetController.getDatasets);
router.get('/datasets/:persistentId', authorise('user'), datasetController.getDataset);

export default router;
