import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import textgoose from 'textgoose';
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
// postSchema.index({title: 'text', text: 'text'});
//
// console.log(userSchema);


// userSchema.plugin(textgoose, {});

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



// import searchPlugin from 'mongoose-search-plugin';

// var Schema = mongoose.Schema({
//   title: String,
//   descirption: String,
//   tags: [String]
// });

// userSchema.plugin(searchPlugin, {
//   fields: ['role'],
// });

// var Model = mongoose.model('MySearchModel', Schema);



// userSchema.on('index', function(err) {
//   if (err) {
//     console.error('User index error: %s', err);
//   } else {
//     console.info('User indexing complete');
//   }
// });
//
// userSchema.index({login: 'text', fullname: 'text', email: 'text'}, {default_language: 'none'});
//
//
// // BookSchema.index(
// //     {
// //          "name": "text",
// //          "description": "text",
// //          "body": "text"
// //     },
// //     {
// //         "weights": {
// //             "name": 5,
// //             "description": 2
// //         }
// //     }
// // )
//
userSchema.index({
  "role": "text",
//   // "local.name": "text",
//   // "local.email": "text",
//   "login.name": "text",
//   // "google.email": "text",
//   // local: {
//   //   'name': 'text',
//   //   'email': 'text',
//   // },
});
// console.log(userSchema );

export default mongoose.model('user', userSchema);
