import { model, Schema } from 'mongoose';

const tokenSchema = new Schema({
    token: { type: String },
    clientId: { type: String },
    createdAt: { type: Date },
});

export const TokenModel = model('Token', tokenSchema);
