import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: String,
    password: String,
    google: {
      id: String,
      token: String,
      email: String,
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
  { collection: 'user', timestamps: true },
);
userSchema.plugin(passportLocalMongoose);

userSchema.pre('save', function (next) {
  this.modified_at = Date.now();
  next();
});

userSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8));

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('user', userSchema);
