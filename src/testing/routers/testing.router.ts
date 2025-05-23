import { Router } from 'express';
import { HttpStatuses } from '../../shared/enums/http-statuses';
import { videosLocalDB } from '../../modules/videos/db/videos.local.db';

export const testingRouters = Router({});

testingRouters.delete('/all-data', (req: Request, res: Response) => {
  videosLocalDB = [];
  res.sendStatus(HttpStatuses.NoContent);
});
