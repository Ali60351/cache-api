import uuid from 'uuid';
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';

import cacheModel from '../models/cache.model';
import { Cache } from '../types';
import { CACHE_LIFE_SPAN } from '../config';

export default class CacheService {
  model = cacheModel;

  index = async () => {
    const caches: Array<Cache> = await this.model.find({}, 'key');
    return caches;
  }

  show = async (key: string) => {
    let cache = await this.model.findOne({ key });

    if (!cache) {
      console.log('Cache miss for', key);

      return new this.model({
        key,
        value: uuid.v4(),
        expiry: addMinutes(new Date(), CACHE_LIFE_SPAN)
      });
    } else if (isPast(cache.expiry)) {
      console.log('Cache miss for', key);

      cache.value = uuid.v4();
      cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
      return await cache.save();
    }

    return cache;
  }
}