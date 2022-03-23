import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server';

import CacheService from '../services/cache.service';

const cacheService = new CacheService();

describe('Test API Endpoints in normal conditions', () => {
  beforeEach(async () => {
    await cacheService.deleteAll();
  });

  it('Expects 201 status code when trying to fetch new key', async () => {
    const response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(201);
  })

  it('Expects 200 status code when trying to fetch old key', async () => {
    let response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(201);

    response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(200);
  })

  it('Expects 201 status code when trying to create new key', async () => {
    let response = await request(app).post('/api/cache/123');
    expect(response.statusCode).toBe(201);
  })

  it('Expects 201 status code when trying to create update old key', async () => {
    let response = await request(app).post('/api/cache/123');
    expect(response.statusCode).toBe(201);

    response = await request(app).post('/api/cache/123');
    expect(response.statusCode).toBe(200);
  })

  it('Expects ["123"] after creating cache key 123', async () => {
    let response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(201);

    response = await request(app).get('/api/cache/');
    expect(response.body).toEqual(["123"]);
  })

  it('Expects deletedCount to be 0 when no key exist for deletion with key', async () => {
    const response = await request(app).delete('/api/cache/123');
    expect(response.body).toEqual({ deleteCount: 0 });
  })

  it('Expects deletedCount to be 0 when no key exist for all key deletion', async () => {
    const response = await request(app).delete('/api/cache/');
    expect(response.body).toEqual({ deleteCount: 0 });
  })

  it('Expects deletedCount to be 1 when no key exist for deletion with key', async () => {
    let response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(201);

    response = await request(app).delete('/api/cache/123');
    expect(response.body).toEqual({ deleteCount: 1 });
  })

  it('Expects deletedCount to be 2 when no key exist for all key deletion', async () => {
    let response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(201);

    response = await request(app).get('/api/cache/321');
    expect(response.statusCode).toBe(201);

    response = await request(app).delete('/api/cache/');
    expect(response.body).toEqual({ deleteCount: 2 });
  })

  it('tests for cache limit exceed flow ', async () => {
    await request(app).post('/api/cache/1');
    await request(app).post('/api/cache/2');
    await request(app).post('/api/cache/3');
    await request(app).post('/api/cache/4');
    await request(app).post('/api/cache/5');
    await request(app).post('/api/cache/6');
    await request(app).post('/api/cache/7');
    await request(app).post('/api/cache/8');
    await request(app).post('/api/cache/9');
    await request(app).post('/api/cache/10');

    const response = await request(app).get('/api/cache/');
    expect(response.body).toEqual(["6", "7", "8", "9", "10"]);
  })

  afterAll(async () => {
    await mongoose.connection.close();
  })
})

describe('Test API with disconnected database', () => {
  beforeAll(async () => {
    await mongoose.connection.close();
  })

  it('Expects GET / route to give 400', async () => {
    const response = await request(app).get('/api/cache/');
    expect(response.statusCode).toBe(400);
  })

  it('Expects GET /:id route to give 400', async () => {
    const response = await request(app).get('/api/cache/123');
    expect(response.statusCode).toBe(400);
  })

  it('Expects POST /:id route to give 400', async () => {
    const response = await request(app).post('/api/cache/123');
    expect(response.statusCode).toBe(400);
  })

  it('Expects DELETE /:id route to give 400', async () => {
    const response = await request(app).delete('/api/cache/123');
    expect(response.statusCode).toBe(400);
  })

  it('Expects DELETE / route to give 400', async () => {
    const response = await request(app).delete('/api/cache/');
    expect(response.statusCode).toBe(400);
  })
});