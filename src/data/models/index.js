import mongoose from 'mongoose';
import config from '../../config';

import User from './User';

mongoose.connect(config.MONGO_URL);

export default User;
