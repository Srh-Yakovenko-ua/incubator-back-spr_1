import { CreateDtoType, Video, VideoResolutions } from '../types/videos';
import { ValidationError } from '../../../shared/types/validation-error';

export const videosUpdatedDtoValidation = (data: Video): ValidationError[] => {
  const errors: ValidationError[] = [];
  const TITLE_MAX_LENGTH = 40;
  const AUTHOR_MAX_LENGTH = 20;
  const ALLOWED_RESOLUTIONS = Object.values(VideoResolutions);

  // Проверка title
  const title = data?.title?.trim();
  if (!title) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title cannot exceed ${TITLE_MAX_LENGTH} characters`,
    });
  }

  // Проверка author
  const author = data?.author?.trim();
  if (!author) {
    errors.push({ field: 'author', message: 'Author is required' });
  } else if (author.length > AUTHOR_MAX_LENGTH) {
    errors.push({
      field: 'author',
      message: `Author name cannot exceed ${AUTHOR_MAX_LENGTH} characters`,
    });
  }

  // Проверка availableResolutions
  const resolutions = data?.availableResolutions;
  if (!resolutions) {
    errors.push({ field: 'availableResolutions', message: 'Resolutions field is required' });
  } else if (!Array.isArray(resolutions)) {
    errors.push({ field: 'availableResolutions', message: 'Resolutions must be an array' });
  } else if (resolutions.length === 0) {
    errors.push({ field: 'availableResolutions', message: 'At least one resolution is required' });
  } else {
    const invalidResolutions = resolutions.filter((res) => !ALLOWED_RESOLUTIONS.includes(res));
    if (invalidResolutions.length > 0) {
      errors.push({
        field: 'availableResolutions',
        message: `Invalid resolutions detected: ${invalidResolutions.join(', ')}. Allowed values: ${ALLOWED_RESOLUTIONS.join(', ')}`,
      });
    }
  }

  if (typeof data?.canBeDownloaded !== 'boolean') {
    errors.push({ field: 'canBeDownloaded', message: 'canBeDownloaded must be a boolean' });
  }

  if (data?.minAgeRestriction !== null && data?.minAgeRestriction !== undefined) {
    if (typeof data.minAgeRestriction !== 'number') {
      errors.push({
        field: 'minAgeRestriction',
        message: 'minAgeRestriction must be a number or null',
      });
    } else if (data.minAgeRestriction < 1 || data.minAgeRestriction > 18) {
      errors.push({
        field: 'minAgeRestriction',
        message: 'minAgeRestriction must be between 1 and 18 (or null for no restriction)',
      });
    }
  }

  if (!data?.publicationDate) {
    errors.push({ field: 'publicationDate', message: 'publicationDate is required' });
  } else {
    // Проверяем, что это строка и соответствует ISO-формату
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    if (typeof data.publicationDate !== 'string' || !isoDateRegex.test(data.publicationDate)) {
      errors.push({
        field: 'publicationDate',
        message:
          'publicationDate must be a valid ISO 8601 date string (e.g., "2025-05-23T18:20:03.000Z")',
      });
    } else {
      // Дополнительная проверка, что дата не "ломает" JS Date
      const date = new Date(data.publicationDate);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'publicationDate',
          message: 'publicationDate is an invalid date (e.g., "3025-13-32T25:70:00.000Z")',
        });
      }
    }
  }

  return errors;
};
