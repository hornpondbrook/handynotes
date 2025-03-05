export interface ValidationError {
  field: 'title' | 'shortcut' | 'description';
  message: string;
}

export const validateTitle = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = value.trim();

  if (!trimmed) {
    errors.push({
      field: 'title',
      message: 'Title cannot be empty'
    });
  }

  if (trimmed.length > 30) {
    errors.push({
      field: 'title',
      message: 'Title cannot exceed 30 characters'
    });
  }

  return errors;
};

export const validateShortcut = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = value.trim();

  if (!trimmed) {
    errors.push({
      field: 'shortcut',
      message: 'Shortcut cannot be empty'
    });
  }

  if (trimmed.length > 20) {
    errors.push({
      field: 'shortcut',
      message: 'Shortcut cannot exceed 20 characters'
    });
  }

  return errors;
};

export const validateDescription = (value: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const trimmed = value.trim();

  if (!trimmed) {
    errors.push({
      field: 'description',
      message: 'Description cannot be empty'
    });
  }

  if (trimmed.length > 50) {
    errors.push({
      field: 'description',
      message: 'Description cannot exceed 50 characters'
    });
  }

  return errors;
};