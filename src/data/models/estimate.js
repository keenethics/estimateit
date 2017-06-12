import mongoose from 'mongoose';

const schema = mongoose.Schema({
  Main: Object,
  Header: Object,
  original: String,
});

const Estimate = mongoose.model('estimateit', schema);

export default Estimate;
