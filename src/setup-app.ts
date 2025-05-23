import express, { Express } from 'express';
import { videosRouters } from './modules/videos/routers/videos.routers';
import { testingRouters } from './testing/routers/testing.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(`/videos`, videosRouters);
  app.use(`/testing`, testingRouters);

  return app;
};
