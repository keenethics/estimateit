import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

mongoose.set('debug', true);
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  local: {
    password: String,
  },
  google: {
    id: String,
    token: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  modified_at: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods.generateHash = function foo(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function foo(password) {
  return bcrypt.compareSync(password, this.local.password);
};


export default mongoose.model('user', userSchema);
