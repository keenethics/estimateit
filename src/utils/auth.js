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
      process.nextTick(async () => {
        if (!req.user) {
          const email = (profile.emails[0].value || '').toLowerCase();
          try {
            const userWithEmail = await User.findOne({ email });

            if (userWithEmail && userWithEmail.status === PENDING) {
              User.findOne({ email }, (err, user) => {
                if (err) {
                  return done(err);
                }
                if (user) {
                  const u = user;
                  u.google.id = profile.id;
                  u.name = profile.displayName;
                  u.google.token = accessToken;
                  u.google.refreshToken = refreshToken;
                  u.email = email;
                  u.status = ACTIVE;
                  u.save((error) => {
                    if (error) {
                      return done(null, false, {
                        success: false,
                        message: error,
                      });
                    }
                    return done(null, {
                      success: true,
                      message: 'Successfully Logged In',
                      user,
                    });
                  });
                }
              });
            } else {
              User.findOne(
                {
                  'google.id': profile.id,
                },
                (err, user) => {
                  if (err) {
                    return done(err);
                  }
                  if (user) {
                    if (!user.google.token) {
                      const u = user;
                      u.google.id = profile.id;
                      u.google.token = accessToken;
                      u.google.refreshToken = refreshToken;
                      u.name = profile.displayName;
                      u.status = ACTIVE;
                      u.email = (profile.emails[0].value || '').toLowerCase();
                      u.save((error) => {
                        if (error) {
                          return done(null, false, {
                            success: false,
                            message: error,
                          });
                        }
                        return done(null, {
                          success: true,
                          message: 'Successfully Logged In',
                          user,
                        });
                      });
                    }
                    return done(null, {
                      success: true,
                      message: 'Successfully Logged In',
                      user,
                    });
                  }

                  const newUser = new User();
                  newUser.status = ACTIVE;
                  newUser.google.id = profile.id;
                  newUser.google.token = accessToken;
                  newUser.google.refreshToken = refreshToken;
                  newUser.name = profile.displayName;
                  newUser.email = (profile.emails[0].value || '').toLowerCase();
                  newUser.save((error) => {
                    if (error) {
                      return done(error);
                    }
                    return done(null, {
                      success: true,
                      message: 'Successfully Logged In',
                      user: newUser,
                    });
                  });
                },
              );
            }
          } catch (error) {
            return done(error);
          }
        } else {
          const user = req.user;
          user.status = ACTIVE;
          user.google.token = profile.id;
          user.google.token = accessToken;
          user.google.refreshToken = refreshToken;
          user.name = profile.displayName;
          user.email = (profile.emails[0].value || '').toLowerCase();
          user.save((err) => {
            if (err) {
              return done(err);
            }

            return done(null, {
              success: true,
              message: 'Successfully Logged In',
              user,
            });
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
