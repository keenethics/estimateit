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
import App from './components/App';
import Html from './components/Html';

import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createApolloClient from './core/createApolloClient/server';
import createFetch from './createFetch';
import router from './router';
import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import config from './config';
import generatePDF from './core/generatePDF';


mongoose.connect(config.MONGO_URL);

const app = express();

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (__DEV__) {
  app.enable('trust proxy');
}

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/graphql', expressGraphQL(req => ({
  schema,
  graphiql: __DEV__,
  rootValue: { request: req },
  pretty: __DEV__,
})));

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
    .wait(2000)
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

    const fetch = createFetch({
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {
      user: req.user || null,
    };

    const apolloClient = createApolloClient({
      schema,
      rootValue: { request: req },
    });

    const store = configureStore(initialState, {
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    });

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
      client: apolloClient,
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
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
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

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
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
  console.info(`The server is running at http://localhost:${config.port}/`);
});
/* eslint-enable no-console */
