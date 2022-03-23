import mongoose from 'mongoose';
import { Cache } from '../types';

const CacheSchema = new mongoose.Schema<Cache>({
  key: String,
  value: String,
  expiry: Date,
});

const CacheModel = mongoose.model<Cache>('CacheModel', CacheSchema);

export default CacheModel;
