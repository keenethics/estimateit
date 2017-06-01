import mongoose from 'mongoose';

const urlEntrySchema = mongoose.Schema({
  original: String,
  shortCode: { type: Number, index: true },
  Main: Object,
  Header: Object,
});
urlEntrySchema.index({ shortCode: 1 });
urlEntrySchema.set('autoIndex', false);

const UrlEntry = mongoose.model('estimateit', urlEntrySchema);
export default UrlEntry;