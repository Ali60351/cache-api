import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server';

import CacheService from '../services/cache.service';

const cacheService = new CacheService();

jest.mock('date-fns/isPast', () => () => true)

describe('Test API Endpoints in case of expired keys', () => {
  beforeEach(async () => {
    await cacheService.deleteAll();
  });

  it('Expects 200 status code when trying to fetch expired key', async () => {
    let response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(201);

    response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(200);
  })

  afterAll(async () => {
    await mongoose.connection.close();
  })
})