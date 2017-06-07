import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  email: String,
  encryptedPassword: String,
});

const User = mongoose.model('User', UserSchema);

export default User;
