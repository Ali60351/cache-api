import * as uuid from 'uuid';
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';

import cacheModel from '../models/cache.model';
import { CACHE_LIFE_SPAN, MAX_CACHE_COUNT } from '../config';

type CacheDocument = Awaited<ReturnType<CacheService['createInstance']>>;

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

  getOrCreate = async (key: string): Promise<[cache: CacheDocument, isCreated: boolean]> => {
    let cache = await this.model.findOne({ key });

    if (!cache) {
      console.log('Cache miss', key);
      const newCache = await this.createInstance(key);
      return [newCache, true];
    } else if (isPast(cache.expiry)) {
      console.log('Cache miss', key);

      cache.value = uuid.v4();
      cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
      const updatedCache = await cache.save();
      return [updatedCache, false];
    }

    console.log('Cache hit', key)
    cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
    const updatedCache = await cache.save();
    return [updatedCache, false];
  }

  createOrUpdate = async (key: string): Promise<[cache: CacheDocument, isCreated: boolean]> => {
    let cache = await this.model.findOne({ key });

    if (cache) {
      cache.value = uuid.v4();
      cache.expiry = addMinutes(new Date(), CACHE_LIFE_SPAN)
      const updatedCache = await cache.save();
      return [updatedCache, false];
    }

    const createdCache = await this.createInstance(key);
    return [createdCache, true];
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