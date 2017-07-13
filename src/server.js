import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import React from 'react';
import ReactDOM from 'react-dom/server';
import mongoose from 'mongoose';
import PrettyError from 'pretty-error';
import Nightmare from 'nightmare';
import passport from 'passport';
import expressValidator from 'express-validator';
import session from 'express-session';
import { formatError } from 'apollo-errors';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createApolloClient from './core/createApolloClient/server';
import createFetch from './createFetch';
import router from './router';
import schema from './data/schema';
import User from './models/user';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import config from './config';
import './utils/auth';
import generatePDF from './core/generatePDF';


mongoose.connect(config.MONGO_URL);
mongoose.Promise = global.Promise;
const app = express();

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
  secret: 'keeneth1cs_secret', // session secret
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


if (__DEV__) {
  app.enable('trust proxy');
}

// Login using passport

app.use((req, res, next) => {
  console.log('isAuthenticated', req.isAuthenticated());
  next();
});

app.post('/login',
  passport.authenticate(
    'local.login',
    {
      successRedirect: '/estimate',
      failureRedirect: '/login',
    },
));

// Signup Using passport
app.post('/register', (req, res, next) => {
  passport.authenticate(
    'local.signup',
    {
      successRedirect: '/',
      failureRedirect: '/register',
    },
    (err, user, message) => {
      if (user) return res.json(user);
      console.log('req', req.user);
      return res.json({ success: false, err, ...message });
    },
  )(req, res, next);
});


app.get('/auth/google/', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/estimate/59629c2a022bef2dd40081c0',
  failureRedirect: '/',
}));

app.get('/auth/logout', (req, res) => {
  console.log('logging out ......');
  req.logout();
  req.session.destroy();
  res.redirect('/');
  // res.send(401);
});


//
// Register API middleware
// -----------------------------------------------------------------------------

app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    formatError,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

app.post('/api/sendPpfToEmails', (req, res) => {
  const { url, emails = '' } = req.body;
  res.end('ok');
  generatePDF(url, emails);
});

app.post('/api/downloadPpdf', (req, res) => {
  const { url } = req.body;

  let nightmare = Nightmare({
    show: false,
  });

  nightmare
    .goto(url)
    .wait(2000)
    .evaluate(() => {
      const body = document.querySelector('body');
      return {
        height: body.scrollHeight,
      };
    })
    .pdf({
      printBackground: true,
      marginsType: 0,
      pageSize: 'A4',
      landscape: false,
    })
    .then((pdfBuffer) => {
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition: attachment; filename=filename.pdf');
      res.send(new Buffer(pdfBuffer, 'binary'));

      nightmare.end();
      nightmare.ended = true;
      nightmare = null;
    })
    .catch((err) => {
      console.error(err);
    });
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();
    const isAuthenticated = req.isAuthenticated();
    let user = {};
    if (isAuthenticated) {
      user = await User.findById(req.user.id);
    }

    const fetch = createFetch({
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
      user: user,
    });


    const initialState = {
      user: req.user,
    };

    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });

    const store = configureStore(initialState, {
      fetch,
      apolloClient,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    const context = {
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      client: apolloClient,
      isAuthenticated,
    };

    const route = await router.resolve({
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context} store={store}>
        {route.component}
      </App>,
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js, assets.client.js];
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
      isAuthenticated: isAuthenticated,
      user: user,
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]}
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
app.listen(config.port, () => {
  console.info(`
  
███████╗███████╗████████╗██╗███╗   ███╗ █████╗ ████████╗ ██████╗ ██████╗ 
██╔════╝██╔════╝╚══██╔══╝██║████╗ ████║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
█████╗  ███████╗   ██║   ██║██╔████╔██║███████║   ██║   ██║   ██║██████╔╝
██╔══╝  ╚════██║   ██║   ██║██║╚██╔╝██║██╔══██║   ██║   ██║   ██║██╔══██╗
███████╗███████║   ██║   ██║██║ ╚═╝ ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
                                                                         
  
  
  The server is running at http://localhost:${config.port}/`);
});
/* eslint-enable no-console */
