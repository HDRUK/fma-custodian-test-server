import { Model } from 'mongoose';
import db from '../config/database';

export const Datasets = <Model<any>>db.model('datasets', new db.Schema({}, { strict: false }), 'datasets');
