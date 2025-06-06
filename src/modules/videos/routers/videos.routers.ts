import { Router, Request, Response } from 'express';
import { videosLocalDB } from '../db/videos.local.db';
import { Video } from '../types/videos';

import { createErrorMessages } from '../../../shared/utils/errors';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { videosCreateDtoValidation } from '../dto/videos-created-dto';
import { videosUpdatedDtoValidation } from '../dto/videos-updated-dto';

export const videosRouters = Router({});

videosRouters
  .get('', (req: Request, res: Response) => {
    res.status(HttpStatuses.Ok).send(videosLocalDB);
  })
  .get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const videos = videosLocalDB.find((d) => d.id === id);
    if (!videos) {
      res
        .status(HttpStatuses.NotFound)
        .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
      return;
    }
    res.status(HttpStatuses.Ok).send(videos);
  });

videosRouters.put('/:id', (req: Request<{ id: string }>, res: Response) => {
  const id = parseInt(req.params.id);

  const index = videosLocalDB.findIndex((v) => v.id === id);
  if (index === -1) {
    res
      .status(HttpStatuses.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }

  const errors = videosUpdatedDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(HttpStatuses.BadRequest).send(createErrorMessages(errors));
    return;
  }

  const updateModel = videosLocalDB[index];
  const data = req.body as Omit<Video, 'createdAt' | 'id'>;

  updateModel.title = data.title;
  updateModel.author = data.author;
  updateModel.canBeDownloaded = data.canBeDownloaded;
  updateModel.publicationDate = data.publicationDate;
  updateModel.minAgeRestriction = data.minAgeRestriction;
  updateModel.availableResolutions = data.availableResolutions;

  res.status(HttpStatuses.NoContent).send(updateModel);
});

videosRouters.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const index = videosLocalDB.findIndex((v) => v.id === id);

  if (index === -1) {
    res
      .status(HttpStatuses.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Video not found' }]));
    return;
  }

  videosLocalDB.splice(index, 1);
  res.sendStatus(HttpStatuses.NoContent);
});

videosRouters.post('', videosCreateDtoValidation, (req: Request, res: Response) => {
  const data = req.body as Pick<Video, 'title' | 'author' | 'availableResolutions'>;
  const createdAt = new Date();
  const publicationDate = new Date(createdAt);
  publicationDate.setDate(publicationDate.getDate() + 1);
  const newVideo: Video = {
    id: videosLocalDB.length ? videosLocalDB[videosLocalDB.length - 1].id + 1 : 0,
    title: data.title,
    author: data.author,
    minAgeRestriction: null,
    canBeDownloaded: false,
    createdAt: createdAt.toISOString(),
    publicationDate: publicationDate.toISOString(),
    availableResolutions: data.availableResolutions,
  };
  videosLocalDB.push(newVideo);
  res.status(HttpStatuses.Created).send(newVideo);
});
