import mongoose from 'mongoose';

const EstimateSchema = mongoose.Schema({
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
