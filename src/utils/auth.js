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
          if (!req.user) {
            const userWithEmail = await User.findOne({ email });
            if (userWithEmail && userWithEmail.status === PENDING) {
              const u = Object.assign({}, userObj, userWithEmail);
              await u.save();
              return done(null, {
                success: true,
                message,
                user: u,
              });                 
            }
            let user = await User.findOne({ 'google.id': profile.id });
            if (user) {
              user.google = google;
            } else {
              console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
              const newUser = await new User(); 
              user = Object.assign({}, userObj, newUser); 
              console.log(user);
            }
            await user.save();
            return done(null, {
              success: true,
              message,
              user,
            });          
            
          }
          const user = req.user;
          await user.save();
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
