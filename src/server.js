import Raven from 'raven';

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressGraphQL from 'express-graphql';
import React from 'react';
import ReactDOM from 'react-dom/server';
import mongoose from 'mongoose';
import PrettyError from 'pretty-error';
import passport from 'passport';
import expressValidator from 'express-validator';
import session from 'express-session';
import { formatError } from 'apollo-errors';
import MongoConnect from 'connect-mongo';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createApolloClient from './core/createApolloClient/server';
import createFetch from './createFetch';
import router from './router';
import schema from './data/schema';
import User from './data/models/user';
import Estimate from './data/models/estimate';

import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import config from './config';
import './utils/auth';
import spreadSheets from './utils/spreadsheets/spreadsheets';

console.log('SENTRY_DSN:', process.env.SENTRY_DSN);
Raven.config(process.env.SENTRY_DSN); // .install();

const MongoStore = MongoConnect(session);

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
app.use(
  session({
    store: new MongoStore({
      url: config.MONGO_URL,
    }),
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

if (__DEV__) {
  app.enable('trust proxy');
}

// Login using passport

app.use((req, res, next) => {
  next();
});

app.get(
  '/auth/google/',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email', 
      'https://www.googleapis.com/auth/spreadsheets',
      //'https://www.googleapis.com/auth/drive',
    ],
    accessType: 'offline',
    prompt: 'consent',
  }),
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/',
  }),
);

app.get('/auth/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

app.post('/spreadsheets', async (req, res) => {
  const { token, refreshToken, estimateId, userId } = req.body;
  const credentials = { access_token: token, refresh_token: refreshToken };
  const spHelper = spreadSheets(credentials);
  const estimate = await Estimate.findById(estimateId);
  const messages = [];
  if (estimate.spreadsheetId && estimate.spreadsheetId[userId]) {
      const getFileResult = await spHelper.getFile(estimate.spreadsheetId[userId]);
      if (getFileResult.reason) messages.push(getFileResult);
      const file = getFileResult;
      if (file && file.id) {
        let deleted = await spHelper.deleteFile(file.id);
        if (deleted.reason) messages.push(deleted);
      }
  }
  spHelper.createSpreadsheet(estimate, async (err, sp) => {
    if (err) {
      if (err.code === 401) {
        const newCredentials = await spHelper.updateCredentials();
        if (newCredentials) {
          const query = { 'google.token': token };
          const projection = { $set: { google: newCredentials } };
          User.update(query, projection);
        }
      } else messages.push(err);
    }
    const { spreadsheetId } = sp;
    const estimate = await Estimate.update({ _id: estimateId }, { $set: { [`spreadsheetId.${userId}`]: spreadsheetId } });
    if (estimate) { 
      messages.push({ message: `Spreadsheet ${spreadsheetId} updated` })
    }
    console.log(messages);
    res.status(200).send({ messages });
    res.end();
  });

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
      user,
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
      user,
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
      isAuthenticated,
      user,
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

app.use((err, req, res) => {
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
