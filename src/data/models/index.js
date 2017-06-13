import mongoose from 'mongoose';
import config from '../../config';

import Estimate from './estimate';
console.log(Estimate);
mongoose.connect(config.MONGO_URL);

export default Estimate;
