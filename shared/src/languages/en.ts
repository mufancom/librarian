import {Translation} from 'translation';

export const en: Translation = {
  INVALID_ARGUMENTS: 'Invalid arguments',
  VALIDATION_FAILED: 'Validation failed',
  AUTHENTICATION_FAILED: 'Authentication failed',
  RESOURCE_NOT_FOUND: 'Resource not found',
  USER_NOT_FOUND: 'User not found',
  CONVENTION_NOT_FOUND: 'Convention not found',
  USERNAME_PASSWORD_MISMATCH: 'Username and password mismatch',
  RESOURCE_CONFLICTING: 'Field already exists',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USERNAME_LENGTH_EXCEPTION: 'Username should be 4-20 characters long',
  PASSWORD_LENGTH_EXCEPTION: 'Password should be 8-48 characters long',
  INVALID_EMAIL_EXCEPTION: 'Please enter a valid email address',
  REGISTER_SUCCESS: 'You are all set!',
  LOGIN_SUCCESS: (username: string) => `Welcome, ${username}`,
  LOGOUT_SUCCESS: 'Successfully logged out',
  PASSWORDS_NOT_CONSISTENT: 'Password does not match the confirm password',
  UNNECESSARY_REQUEST: 'Unnecessary request',
};
