const MIN_USERNAME_LENGTH = 7;
const MAX_LENGTH = 16;
const MIN_PASSWORD_LENGTH = 6;

export function validateUsername(value: string): string[] {
  const errors: string[] = [];

  if (!value.includes(')))')) {
    errors.push('Must contain three smiley brackets in a row. Here you go - )))');
  }

  if (value.includes(' ')) {
    errors.push('Must not contain spaces.');
  }

  if (!/[A-Za-zА-Яа-я]/.test(value)) {
    errors.push('Must contain at least one letter.');
  }

  if (value.length < MIN_USERNAME_LENGTH) {
    errors.push(`Must be at least ${MIN_USERNAME_LENGTH} characters long.`);
  }

  if (value.length > MAX_LENGTH) {
    errors.push(`Must be at most ${MAX_LENGTH} characters long.`);
  }

  return errors;
}

export function validatePassword(value: string): string[] {
  const errors: string[] = [];

  if (value.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
  }

  if (!/[0-9]/.test(value)) {
    errors.push('Must contain at least one digit.');
  }

  if (!/[A-Za-zА-Яа-я]/.test(value)) {
    errors.push('Must contain at least one letter.');
  }

  if (value.length > MAX_LENGTH) {
    errors.push(`Must be at most ${MAX_LENGTH} characters long.`);
  }

  return errors;
}
