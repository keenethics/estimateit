import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {

    local: {
      email: String,
      password: String,
    },
    google: {
      email: String,
      id: String,
      token: String,
      name: String,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    modified_at: {
      type: Date,
      default: Date.now(),
    },
  },
);

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};
export default mongoose.model('user', userSchema);
