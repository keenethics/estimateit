import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotend from 'dotenv';
import Nightmare from 'nightmare';

import UrlEntry from './models/schema';
import { createFullUrl, isValidUrl } from './utils/url';
import { isDuplicate, insertNew } from './utils/mongo';

const nightmare = Nightmare({ show: false });
const config = dotend.config();
const app = express();
const router = express.Router();

const port = process.env.API_PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('common'));

const mongoDB = process.env.DB_HOST;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('we are connected!');
});

app.get('/:shortCode', (req, res) => {
  const shortCode = parseInt(req.params.shortCode);
  if (isNaN(shortCode)) {
    res.status(500).json({ error: 'Invalid URL shortCode.' });
  } else {
    UrlEntry.findOne({ shortCode }).then(doc => {
      if (!doc) {
        res.status(404).json({ error: 'Page not found' });
      } else {
        res.status(200).json({
          data: {
            header: doc.Header,
            main: doc.Main,
          },
        });
      }
    });
  }
});
app.post('/api/pdf', (req, res) => {
  const { url } = req.body;
  nightmare
    .goto(url)
    .wait(2000)
    .inject('css', './server/utils/pdf.css')
    .evaluate(() => {
      const body = document.querySelector('body');
      return {
        height: body.scrollHeight
      };
    })
    .pdf({
      printBackground: true,
      marginsType: 0,
      pageSize: 'A4',
      landscape: false
    })
    .run((error, pdfBuffer) => {
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition: attachment; filename=filename.pdf');
      res.send(new Buffer(pdfBuffer, 'binary'));
    });
});

app.post('/new', (req, res) => {
  const { url, data } = req.body;
  console.log('data', data);
  isDuplicate(url).then(exists => {
    if (exists) {
      res.status(500).json({
        message: 'URL already exists in the database.',
        url: createFullUrl(req, exists)
      });
    } else {
      insertNew(url, data).then(inserted => {
        res.status(200).json({
          message: 'Url successfully shortened',
          url: createFullUrl(req, inserted.shortCode),
          origin: inserted.origin
        });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`api running on port ${port}`);
});
