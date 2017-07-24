import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  local: {
    email: String,
    password: String,
  },
  google: {
    id: String,
    name: String,
    email: String,
    token: String,
  },
  role: {
    type: String,
    default: 'customer',
    enum: ['admin', 'manager', 'customer'],
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

userSchema.index({ 'local.email': 'text', 'google.email': 'text' });

userSchema.pre('save', function (next) {
  const email = this.local.email || this.google.email;
  const emailDomain = email.substring(email.lastIndexOf('@') + 1);
  if (emailDomain === 'keenethics.com') {
    this.role = 'manager';
  }
  next();
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

export default mongoose.model('user', userSchema);
