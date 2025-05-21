import { ValidationError } from '../types/validation-error';

export const createErrorMessages = (
  errors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: errors };
};
