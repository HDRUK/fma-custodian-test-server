import db from '../config/database';

export const Datasets = db.model('datasets', new db.Schema({}, { strict: false }), 'datasets');
