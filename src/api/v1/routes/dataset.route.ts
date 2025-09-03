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

router.get('/noauth/exemplar/datasets', validateParams, datasetController.getExemplarDatasets);
router.get('/noauth/exemplar/datasets/:persistentId', datasetController.getExemplarDataset);

// Protected endpoints - API key or OAuth access token
router.get('/datasets', authorise(), validateParams, datasetController.getDatasets);
router.get('/datasets/:persistentId', authorise(), datasetController.getDataset);

export default router;
