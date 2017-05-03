import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const router = express.Router();

const port = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' });
});
app.use('/api', router);

app.listen(port, () => {
  console.log(`api running on port ${port}`);
});
