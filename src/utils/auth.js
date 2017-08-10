import passport from 'passport';
import passportLocal from 'passport-local';
import { OAuth2Strategy } from 'passport-google-oauth';
import { User } from '../data/models';
import config from '../config';

const LocalStrategy = passportLocal.Strategy;

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
      req.check('name', 'Invalid name').notEmpty();
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
      if (!req.user) {
        return User.findOne({ 'local.email': username }, (err, user) => {
          if (err) return done(err);
          if (user) {
            return done(null, false, {
              success: false,
              message: 'Email Already exists',
            });
          }
          const newUser = new User();
          newUser.name = req.body.name;
          newUser.email = username;
          newUser.local.password = newUser.generateHash(password);
          return newUser.save((error, res) => {
            if (error) {
              return done(null, false, {
                success: false,
                message: `error saving user, ${error}`,
              });
            }
            const { email, _id, createdAt } = res;
            return done(null, {
              success: true,
              message: 'Successfully Registered',
              user: { _id, email, createdAt },
            });
          });
        });
      } else if (!req.user.email) {
        return User.findOne({ 'local.email': username }, (err, user) => {
          if (err) return done(err);
          if (user) {
            return done(null, false, {
              success: false,
              message: 'That email is already taken',
            });
          }
          const newUser = req.user;
          newUser.name = req.body.name;
          newUser.email = username;
          newUser.local.password = newUser.generateHash(password);
          return newUser.save((error, res) => {
            if (error) {
              return done(null, false, {
                success: false,
                message: `Error saving user, ${error}`,
              });
            }
            const { _id, email, createdAt } = res;
            return done(null, {
              success: true,
              message: 'successfully Registered',
              user: { _id, email, createdAt },
            });
          });
        });
      }
      return done(null, req.user);
    },
  ),
);

passport.use(
  'local.login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
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
      return User.findOne({ 'local.email': username }, (err, user) => {
        if (err) {
          return done(null, false, err);
        }
        if (!user) {
          return done(null, false, {
            success: false,
            message: 'Oops! Unable to log in.',
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            success: false,
            message: 'Oops! Unable to log in.',
          });
        }
        return done(null, {
          success: true,
          message: 'Successfully Logged In',
          user,
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
        if (!req.user) {
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
                  u.google.token = accessToken;
                  u.name = profile.displayName;
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
              newUser.google.id = profile.id;
              newUser.google.token = accessToken;
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
        } else {
          const user = req.user;
          user.google.token = profile.id;
          user.google.token = accessToken;
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
