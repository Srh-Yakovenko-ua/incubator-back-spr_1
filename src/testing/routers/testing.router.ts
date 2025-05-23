import { Router, Request, Response } from 'express';
import { HttpStatuses } from '../../shared/enums/http-statuses';
import { videosLocalDB } from '../../modules/videos/db/videos.local.db';

export const testingRouters = Router({});
const clearVideosDB = () => {
  videosLocalDB.length = 0;
};
testingRouters.delete('/all-data', (req: Request, res: Response) => {
  clearVideosDB();
  res.sendStatus(HttpStatuses.NoContent);
});
