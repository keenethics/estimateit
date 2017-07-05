import mongoose from 'mongoose';

const EstimateSchema = mongoose.Schema({
  date: {
    type: String,
  },
  clientName: {
    type: String,
  },
  projectName: {
    type: String,
  },
  data: {
    type: String,
  },
  sprintNumber: {
    type: String,
  },
  comments: {
    type: String,
  },
  technologies: {
    type: Array,
  },
  pm: {
    type: String,
  },
  skype: {
    type: String,
  },
  email: {
    type: String,
  },
  position: {
    type: String,
  },
  moneyRate: {
    type: String,
  },
  estimateOptions: {
    type: Object,
  },
  devHours: {
    type: Object,
  },
  tasks: {
    type: Array,
  },
});

const Estimate = mongoose.model('estimates', EstimateSchema);

export default Estimate;
