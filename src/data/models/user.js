import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

mongoose.set('debug', true);
const Schema = mongoose.Schema;

const userSchema = new Schema({
  local: {
    name: String,
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

userSchema.pre('save', (next) => {
  const email = this.local.email || this.google.email;
  const emailDomain = email.substring(email.lastIndexOf('@') + 1);
  if (emailDomain === 'keenethics.com') {
    this.role = 'manager';
  }
  next();
});

userSchema.methods.generateHash = password => (
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
);

userSchema.methods.validPassword = password => (
  bcrypt.compareSync(password, this.local.password)
);

userSchema.index({
  role: 'text',
});

export default mongoose.model('user', userSchema);
