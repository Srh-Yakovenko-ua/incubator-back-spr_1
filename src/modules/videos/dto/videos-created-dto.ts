import { ValidationError } from '../../../shared/types/validation-error';
import { CreateDtoType, VideoResolutions } from '../types/videos';
import { Response, Request, NextFunction } from 'express';
import { HttpStatuses } from '../../../shared/enums/http-statuses';
import { createErrorMessages } from '../../../shared/utils/errors';
export const videosCreateDtoValidation = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as CreateDtoType;

  const errors: ValidationError[] = [];
  const TITLE_MAX_LENGTH = 40;
  const AUTHOR_MAX_LENGTH = 20;
  const ALLOWED_RESOLUTIONS = Object.values(VideoResolutions);

  const title = data?.title?.trim();
  if (!title) {
    errors.push({
      message: 'Title is required',
      field: 'title',
    });
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.push({
      message: `Title cannot exceed ${TITLE_MAX_LENGTH} characters`,
      field: 'title',
    });
  }

  const author = data?.author?.trim();
  if (!author) {
    errors.push({ message: 'Author is required', field: 'author' });
  } else if (author.length > AUTHOR_MAX_LENGTH) {
    errors.push({
      message: `Author name cannot exceed ${AUTHOR_MAX_LENGTH} characters`,
      field: 'author',
    });
  }

  const resolutions = data?.availableResolutions;

  if (!resolutions) {
    errors.push({ message: 'Resolutions field is required', field: 'availableResolutions' });
  } else if (!Array.isArray(resolutions)) {
    errors.push({ message: 'Resolutions must be an array', field: 'availableResolutions' });
  } else if (resolutions.length === 0) {
    errors.push({ message: 'At least one resolution is required', field: 'availableResolutions' });
  } else {
    const invalidResolutions = resolutions.filter((res) => !ALLOWED_RESOLUTIONS.includes(res));
    console.log(invalidResolutions, 'invalidResolutions');
    if (invalidResolutions.length > 0) {
      errors.push({
        message:
          `Invalid resolutions detected: ${invalidResolutions.join(', ')}. ` +
          `Allowed values: ${ALLOWED_RESOLUTIONS.join(', ')}`,
        field: 'availableResolutions',
      });
    }
  }
  if (errors.length > 0) {
    res.status(HttpStatuses.BadRequest).send(createErrorMessages(errors));
    return;
  }

  next();
};
