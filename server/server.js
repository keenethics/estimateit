import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotend from 'dotenv';

const config = dotend.config();
const app = express();
const router = express.Router();

const port = process.env.API_PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));

const mongoDB = process.env.DB_HOST;
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('hi');
});
app.get('/api', (req, res) => {
  res.json({ message: 'API Initialized!' });
});

app.get('/:encoded_id', (req, res) => {
  // route to redirect the visitor to their original URL given the short URL
});

app.post('/api/shorten', (req, res) => {
  // route to create and return a shortened URL given a long URL
});

app.listen(port, () => {
  console.log(`api running on port ${port}`);
});
