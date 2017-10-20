import passport from 'passport';
import passportLocal from 'passport-local';
import { OAuth2Strategy } from 'passport-google-oauth';
import { User } from '../data/models';
import config from '../config';
import {
  ACTIVE,
  PENDING,
} from '../constants/userStatus';

/* eslint-disable */
const LocalStrategy = passportLocal.Strategy;
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
      const { displayName, id, emails } = profile;
      const email = (emails[0].value || '').toLowerCase();
      const google = {
        id: profile.id, 
        token: accessToken,
        refreshToken,
      }
      const userObj = {
        google,
        name: displayName,
        email: email,
        status: ACTIVE,
      }
      const message = 'Successfully Logged In';
      process.nextTick(async () => {
        try {
          let user = req.user;
          if (!req.user) {
            user = await User.findOne({ email });
            if (user && user.status === PENDING) {
              user = Object.assign({}, user, userObj);
              console.log('pending user', user);
            } else {
              user = await User.findOne({ 'google.id': profile.id });
              if (user) {
                user.google = google;
              } else {
                user = await new User(userObj); 
              }           
            }
          await user.save();
          } else {
            user = req.user;
          } 
          return done(null, {
            success: true,
            message,
            user,
          });
        } catch (error) {
            return done(null, false, {
            success: false,
            message: error,
          });           
        }
      });
    },
  ),
);

passport.serializeUser((req, done) => {
  done(null, req.user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, req) => {
    done(err, req);
  });
});
