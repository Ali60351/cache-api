import * as uuid from 'uuid';
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';

import cacheModel from '../models/cache.model';
import { CACHE_LIFE_SPAN, MAX_CACHE_COUNT } from '../config';

export default class CacheService {
  model = cacheModel;

  maintainCacheLimit = async () => {
    let caches = await this.model.find({}).sort({ expiry: 1 });
    let cacheCount = caches.length;

    for (const cache of caches) {
      const cacheExpired = isPast(cache.expiry);
      const cacheOverflown = (cacheCount + 1) > MAX_CACHE_COUNT;

      if (cacheExpired || cacheOverflown) {
        await cache.remove();
        cacheCount = cacheCount - 1;
      }
    }
  }

  createInstance = async (key: string) => {
    this.maintainCacheLimit();

    const cache = new this.model({
      key,
      value: uuid.v4(),
      expiry: addMinutes(new Date(), CACHE_LIFE_SPAN)
    });

    return await cache.save();
  }

  index = async () => {
    const caches = await this.model.find({}, 'key');
    return caches;
  }

  getOrCreate = async (key: string) => {
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
    cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
    return await cache.save();
  }

  createOrUpdate = async (key: string) => {
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