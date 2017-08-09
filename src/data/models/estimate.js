import mongoose from 'mongoose';

const EstimateSchema = mongoose.Schema({
  owner: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  clientName: {
    type: String,
    default: '',
  },
  projectName: {
    type: String,
    default: '',
  },
  data: {
    type: String,
  },
  sprintNumber: {
    type: String,
    default: '',
  },
  comments: {
    type: String,
    default: '',
  },
  technologies: {
    type: Array,
    default: [],
  },
  pm: {
    type: String,
    default: '',
  },
  skype: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: '',
  },
  moneyRate: {
    type: String,
    default: 25,
  },
  estimateOptions: {
    qa: {
      type: String,
      default: 10,
    },
    pm: {
      type: String,
      default: 10,
    },
    risks: {
      type: String,
      default: 10,
    },
    bugFixes: {
      type: String,
      default: 10,
    },
    probability: {
      type: String,
      default: 100,
    },
  },
  tasks: {
    type: Array,
  },
  contributors: {
    type: Array,
    default: [],
  },
  isRemoved: {
    type: Boolean,
  },
});

const Estimate = mongoose.model('estimates', EstimateSchema);

export default Estimate;
