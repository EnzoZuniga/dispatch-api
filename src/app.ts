import express from 'express';
import authRoutes from './modules/auth/routes';
import missionRoutes from './modules/missions/routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/auth', authRoutes);
  app.use('/missions', missionRoutes);

  app.use(errorHandler);

  return app;
}
