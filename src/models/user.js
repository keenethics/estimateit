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
    role: {
      type: String,
      enum: ['admin', 'manager', 'customer'],
      default: 'customer',
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
