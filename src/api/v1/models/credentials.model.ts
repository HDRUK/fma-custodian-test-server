import { model, Schema } from 'mongoose';

const credentialsSchema = new Schema({
    clientId: String,
    clientSecret: String,
    clientName: String,
    clientEmail: String,
    clientType: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    apiSecret: String,
});

export const CredentialsModel = model('Credentials', credentialsSchema);
