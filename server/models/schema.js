import mongoose from 'mongoose';

const urlEntrySchema = mongoose.Schema({
  original: String,
  Main: Object,
  Header: Object,
});

const UrlEntry = mongoose.model('estimateit', urlEntrySchema);
export default UrlEntry;
