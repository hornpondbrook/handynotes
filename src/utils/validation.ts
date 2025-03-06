import { VALIDATION } from '../config';


export interface ValidationError {
  field: 'title' | 'shortcut' | 'description';
  message: string;
}

export const validateTitle = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = value.trim();

  if (trimmed.length < VALIDATION.TITLE.MIN_LENGTH) {
    errors.push({
      field: 'title',
      message: 'Title cannot be empty'
    });
  }

  if (trimmed.length > VALIDATION.TITLE.MAX_LENGTH) {
    errors.push({
      field: 'title',
      message: `Title cannot exceed ${VALIDATION.TITLE.MAX_LENGTH} characters`
    });
  }

  return errors;
};

export const validateShortcut = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = value.trim();

  if (trimmed.length < VALIDATION.SHORTCUT.MIN_LENGTH) {
    errors.push({
      field: 'shortcut',
      message: 'Shortcut cannot be empty'
    });
  }

  if (trimmed.length > VALIDATION.SHORTCUT.MAX_LENGTH) {
    errors.push({
      field: 'shortcut',
      message: `Shortcut cannot exceed ${VALIDATION.SHORTCUT.MAX_LENGTH} characters`
    });
  }

  return errors;
};

export const validateDescription = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = value.trim();

  if (trimmed.length < VALIDATION.DESCRIPTION.MIN_LENGTH) {
    errors.push({
      field: 'description',
      message: 'Description cannot be empty'
    });
  }

  if (trimmed.length > VALIDATION.DESCRIPTION.MAX_LENGTH) {
    errors.push({
      field: 'description',
      message: `Description cannot exceed ${VALIDATION.DESCRIPTION.MAX_LENGTH} characters`
    });
  }

  return errors;
};