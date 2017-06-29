import passport from 'passport';
import passportLocal from 'passport-local';
import { OAuth2Strategy } from 'passport-google-oauth';
import User from '../models/user';
import { createToken } from './index';
import config from '../config';

const LocalStrategy = passportLocal.Strategy;

// Sign Up using Passport Local strategy
passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      req.check('email', 'Invalid email').notEmpty().isEmail();
      req.check('password', 'Invalid Password').notEmpty().isLength({ min: 6 });
      const errors = req.validationErrors();
      if (errors) {
        const messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        return done(errors);
      }
      return User.findOne({ email: username }, (err, user) => {
        if (err) return done(err);
        if (user) {
          return done(null, false, {
            success: false,
            errors: [
              {
                msg: 'Email Already exists',
              },
            ],
          });
        }
        const newUser = new User();
        newUser.email = username;
        newUser.password = password;
        console.log('newUser', newUser);
        return newUser.save((err, res) => {
          if (err) {
            return done(null, false, {
              success: false,
              message: 'error saving user',
            });
          }
          const { email, _id, createdAt } = res;
          return done(null, {
            success: true,
            message: 'successfully Registered',
            user: { _id, email, createdAt },
          });
        });
      });
    },
  ),
);

// LogIn using Passport Local strategy
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      req.check('email', 'Invalid email').notEmpty().isEmail();
      req.check('password', 'Invalid Password').notEmpty().isLength({ min: 6 });
      const errors = req.validationErrors();
      if (errors) {
        const messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        return done(errors);
      }
      return User.findOne({ email: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            success: false,
            message: 'Incorrect username.',
          });
        }
        if (!user.comparePassword(password)) {
          return done(null, false, {
            success: false,
            message: 'Incorrect password.',
          });
        }
        const { _id, email, createdAt } = user;
        const token = createToken({ _id, email, createdAt });
        return done(null, {
          success: true,
          message: 'Successfully Logged In',
          user: { _id, email, createdAt, token },
        });
      });
    },
  ),
);

passport.use(
  'google',
  new OAuth2Strategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL,
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne(
          {
            id: profile.id,
          },
          (err, user) => {
            if (err) {
              return done(err);
            }
            if (user) {
              return done(null, user, {
                success: true,
                msg: 'You are now connected!',
              });
            }
            const newUser = new User();
            newUser.google.id = profile.id;
            newUser.google.token = accessToken;
            newUser.google.name = profile.displayName;
            newUser.google.email = profile.emails[0].value;
            console.log('newUser', newUser);
            newUser.save((err) => {
              if (err) {
                console.log('Error when we try createGoogle account');
                throw err;
              }
              return done(null, newUser, {
                success: true,
                msg: 'You are now registered !',
              });
            });
          },
        );
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findOne(
    {
      _id: id,
    },
    '-password',
    (err, user) => {
      done(err, user);
    },
  );
});
