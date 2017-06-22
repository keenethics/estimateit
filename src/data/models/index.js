import mongoose from 'mongoose';
import config from '../../config';

import Estimate from './estimate';

mongoose.connect(config.MONGO_URL);

export default Estimate;
