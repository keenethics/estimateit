import mongoose from 'mongoose';
import config from '../../config';

mongoose.connect(config.MONGO_URL);

export { default as Estimate } from './estimate';
export { default as User } from './user';
