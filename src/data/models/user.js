import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import {
  ACTIVE,
  PENDING,
} from '../../constants/userStatus';

mongoose.set('debug', true);
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: [ACTIVE, PENDING],
  },
  google: {
    id: String,
    token: String,
    refreshToken: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  modified_at: {
    type: Date,
    default: Date.now(),
  },
}, { versionKey: false });

userSchema.methods.generateHash = function foo(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function foo(password) {
  return bcrypt.compareSync(password, this.local.password);
};


export default mongoose.model('user', userSchema);
