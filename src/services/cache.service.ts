import uuid from 'uuid';
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';

import cacheModel from '../models/cache.model';
import { Cache } from '../types';
import { CACHE_LIFE_SPAN } from '../config';

export default class CacheService {
  model = cacheModel;

  createInstance = async (key: string) => {
    const cache = new this.model({
      key,
      value: uuid.v4(),
      expiry: addMinutes(new Date(), CACHE_LIFE_SPAN)
    });

    return await cache.save();
  }

  index = async () => {
    const caches: Array<Cache> = await this.model.find({}, 'key');
    return caches;
  }

  show = async (key: string) => {
    let cache = await this.model.findOne({ key });

    if (!cache) {
      console.log('Cache miss', key);
      return await this.createInstance(key);
    } else if (isPast(cache.expiry)) {
      console.log('Cache miss', key);

      cache.value = uuid.v4();
      cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
      return await cache.save();
    }

    console.log('Cache hit', key)
    return cache;
  }

  create = async (key: string) => {
    let cache = await this.model.findOne({ key });

    if (cache) {
      cache.value = uuid.v4();
      cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
      return cache.save();
    }

    return await this.createInstance(key);
  }

  delete = async (key: string) => {
    const { deletedCount } = await this.model.deleteOne({ key });
    return deletedCount;
  }

  deleteAll = async () => {
    const { deletedCount } = await this.model.deleteMany({});
    return deletedCount;
  }
}