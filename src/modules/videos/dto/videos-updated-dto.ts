import { CreateDtoType, Video, VideoResolutions } from '../types/videos';
import { ValidationError } from '../../../shared/types/validation-error';

export const videosUpdatedDtoValidation = (data: Video): ValidationError[] => {
  const errors: ValidationError[] = [];
  const TITLE_MAX_LENGTH = 40;
  const AUTHOR_MAX_LENGTH = 20;
  const ALLOWED_RESOLUTIONS = Object.values(VideoResolutions);

  const title = data?.title?.trim();
  if (!title) {
    errors.push({ message: 'Title is required', field: 'title' });
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
    errors.push({
      message: 'Resolutions field is required',
      field: 'availableResolutions',
    });
  } else if (!Array.isArray(resolutions)) {
    errors.push({ message: 'Resolutions must be an array', field: 'availableResolutions' });
  } else if (resolutions.length === 0) {
    errors.push({ message: 'At least one resolution is required', field: 'availableResolutions' });
  } else {
    const invalidResolutions = resolutions.filter((res) => !ALLOWED_RESOLUTIONS.includes(res));
    if (invalidResolutions.length > 0) {
      errors.push({
        message: `Invalid resolutions detected: ${invalidResolutions.join(', ')}. Allowed values: ${ALLOWED_RESOLUTIONS.join(', ')}`,
        field: 'availableResolutions',
      });
    }
  }

  if (typeof data?.canBeDownloaded !== 'boolean') {
    errors.push({ message: 'canBeDownloaded must be a boolean', field: 'canBeDownloaded' });
  }

  if (data?.minAgeRestriction !== null && data?.minAgeRestriction !== undefined) {
    if (typeof data.minAgeRestriction !== 'number') {
      errors.push({
        message: 'minAgeRestriction must be a number or null',
        field: 'minAgeRestriction',
      });
    } else if (data.minAgeRestriction < 1 || data.minAgeRestriction > 18) {
      errors.push({
        message: 'minAgeRestriction must be between 1 and 18 (or null for no restriction)',
        field: 'minAgeRestriction',
      });
    }
  }

  if (!data?.publicationDate) {
    errors.push({ message: 'publicationDate is required', field: 'publicationDate' });
  } else {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof data.publicationDate !== 'string' || !isoDateRegex.test(data.publicationDate)) {
      errors.push({
        message:
          'publicationDate must be a valid ISO 8601 date string (e.g., "2025-05-23T18:20:03.000Z")',
        field: 'publicationDate',
      });
    } else {
      const date = new Date(data.publicationDate);
      if (isNaN(date.getTime())) {
        errors.push({
          message: 'publicationDate is an invalid date (e.g., "3025-13-32T25:70:00.000Z")',
          field: 'publicationDate',
        });
      }
    }
  }

  return errors;
};
