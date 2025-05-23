import express, { Express } from 'express';
import { videosRouters } from './modules/videos/routers/videos.routers';
import { testingRouters } from './testing/routers/testing.router';

const INIT_ROUTE_HW_01 = '/hometask_01/api';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(`${INIT_ROUTE_HW_01}/videos`, videosRouters);
  app.use(`${INIT_ROUTE_HW_01}/testing`, testingRouters);

  return app;
};
