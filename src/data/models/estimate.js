import mongoose from 'mongoose';

const EstimateSchema = mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  main: {
    type: Object,
    required: true,
  },
  header: {
    type: Object,
    required: true,
  },
});

const Estimate = mongoose.model('estimates', EstimateSchema);

export default Estimate;
