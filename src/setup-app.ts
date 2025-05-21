import express, { Express } from 'express';
import { videosRouters } from './modules/videos/routers/videos.routers';

const INIT_ROUTE_HW_01 = '/hometask_01/api';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.use(`${INIT_ROUTE_HW_01}/videos`, videosRouters);

  app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
  });
  return app;
};
