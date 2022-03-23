import mongoose from 'mongoose';

const CacheSchema = new mongoose.Schema({
  key: String,
  value: String,
  expiry: Date,
});

const CacheModel = mongoose.model('CacheModel', CacheSchema);

export default CacheModel;
