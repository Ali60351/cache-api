import mongoose from "mongoose";
import express, { Request, Response, NextFunction } from "express";
import CacheService from '../services/cache.service';

const app = express.Router();

const cacheService = new CacheService();

app.use((req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(400);
    res.json({ error: 'Server not ready!' });
  } else {
    next();
  }
})

app.get('/', async (req: Request, res: Response) => {
  const caches = await cacheService.index();

  res.status(200);
  res.json(caches.map(cache => cache.key));
});

app.get('/:key', async (req: Request, res: Response) => {
  const { key } = req.params;
  const [cache, created] = await cacheService.getOrCreate(key);

  res.status(created ? 201 : 200);
  res.json(cache.value)
});

app.post('/:key', async (req: Request, res: Response) => {
  const { key } = req.params;
  const [cache, created] = await cacheService.createOrUpdate(key);

  res.status(created ? 201 : 200);
  res.json(cache.value)
});

app.delete('/:key', async (req: Request, res: Response) => {
  const { key } = req.params;
  const deleteCount = await cacheService.delete(key);

  res.status(200);
  res.json({ deleteCount });
});

app.delete('/', async (req: Request, res: Response) => {
  const deleteCount = await cacheService.deleteAll();

  res.status(200);
  res.json({ deleteCount });
});

export default app;
