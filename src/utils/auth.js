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
      process.nextTick(async () => {
        if (!req.user) {
          try {
            const userWithEmail = await User.findOne({ email });
            if (userWithEmail && userWithEmail.status === PENDING) {
              const u = userWithEmail;
              u.google.id = id;
              u.name = displayName;
              u.google.token = accessToken;
              u.google.refreshToken = refreshToken;
              u.email = email;
              u.status = ACTIVE;
              await u.save();
              return done(null, {
                success: true,
                message: 'Successfully Logged In',
                user: u,
              });                 


            } else {

              const user = await User.findOne({ 'google.id': profile.id });
              let returnUser = user;
              if (user) {
                  const u = user;
                  u.google.id = profile.id;
                  u.google.token = accessToken;
                  u.google.refreshToken = refreshToken;
                  returnUser = await u.save(); 
              } else {
                  const newUser = new User();
                  newUser.status = ACTIVE;
                  newUser.google.id = profile.id;
                  newUser.google.token = accessToken;
                  newUser.google.refreshToken = refreshToken;
                  newUser.name = profile.displayName;
                  newUser.email = email;
                  returnUser = await newUser.save();

              }
              return done(null, {
                success: true,
                message: 'Successfully Logged In',
                user: returnUser,
              });              

              
            }
          } catch (error) {
              return done(null, false, {
                success: false,
                message: error,
              });     
          }
        } else {
          try {
            const user = req.user;
            user.status = ACTIVE;
            user.google.token = profile.id;
            user.google.token = accessToken;
            user.google.refreshToken = refreshToken;
            user.name = profile.displayName;
            user.email = email;
            await user.save();
            return done(null, {
              success: true,
              message: 'Successfully Logged In',
              user,
            });

          } catch (err) {
              return done(null, false, {
                success: false,
                message: error,
              });        
          }

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
