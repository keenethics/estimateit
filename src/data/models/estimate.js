import mongoose from 'mongoose';

const EstimateSchema = mongoose.Schema({
  main: Object,
  header: Object,
});

const Estimate = mongoose.model('estimates', EstimateSchema);

export default Estimate;
