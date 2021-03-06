import express from 'express';

import cacheRoutes from './routes/cache.routes';
import './database';

const app = express();

app.use('/api/cache', cacheRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Server is ready!" });
})

export default app;
