import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: 'user', timestamps: true },
);

userSchema.pre('save', function(next) {
  const user = this;
  // If user is now yet created
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(pass) {
  const user = this;
  return bcrypt.compareSync(pass, user.password);
};

export default mongoose.model('user', userSchema);
