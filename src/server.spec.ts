import mongoose from 'mongoose';
import request from 'supertest';

import app from './server';

describe('Test express server', () => {
  it('checks if / returns 200', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  })
})