import { ValidationError } from '../../../shared/types/validation-error';
import { CreateDtoType, VideoResolutions } from '../types/videos';

export const videosCreateDtoValidation = (data: CreateDtoType): ValidationError[] => {
  const errors: ValidationError[] = [];
  const TITLE_MAX_LENGTH = 40;
  const AUTHOR_MAX_LENGTH = 20;
  const ALLOWED_RESOLUTIONS = Object.values(VideoResolutions);

  const title = data?.title?.trim();
  if (!title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title cannot exceed ${TITLE_MAX_LENGTH} characters`,
    });
  }

  const author = data?.author?.trim();
  if (!author) {
    errors.push({ field: 'author', message: 'Author is required' });
  } else if (author.length > AUTHOR_MAX_LENGTH) {
    errors.push({
      field: 'author',
      message: `Author name cannot exceed ${AUTHOR_MAX_LENGTH} characters`,
    });
  }

  const resolutions = data?.availableResolutions;

  if (!resolutions) {
    errors.push({ field: 'availableResolutions', message: 'Resolutions field is required' });
  } else if (!Array.isArray(resolutions)) {
    errors.push({ field: 'availableResolutions', message: 'Resolutions must be an array' });
  } else if (resolutions.length === 0) {
    errors.push({ field: 'availableResolutions', message: 'At least one resolution is required' });
  } else {
    const invalidResolutions = resolutions.filter((res) => !ALLOWED_RESOLUTIONS.includes(res));
    console.log(invalidResolutions, 'invalidResolutions');
    if (invalidResolutions.length > 0) {
      errors.push({
        field: 'availableResolutions',
        message:
          `Invalid resolutions detected: ${invalidResolutions.join(', ')}. ` +
          `Allowed values: ${ALLOWED_RESOLUTIONS.join(', ')}`,
      });
    }
  }

  return errors;
};
