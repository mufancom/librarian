import {Translation} from '../translation';

export const en: Translation = {
  INVALID_ARGUMENTS: 'Invalid arguments',

  VALIDATION_FAILED: 'Validation failed',
  USERNAME_LENGTH_EXCEPTION: 'Username should be 4-20 characters long',
  PASSWORD_LENGTH_EXCEPTION: 'Password should be 8-48 characters long',
  INVALID_EMAIL_EXCEPTION: 'Please enter a valid email address',
  INVALID_PAGE_NUMBER: 'Please submit a valid page number',

  AUTHENTICATION_FAILED: 'Authentication failed',
  USERNAME_PASSWORD_MISMATCH: 'Username and password mismatch',
  NO_ACCESS_TO_CURRENT_COMMENT: 'Permission not granted to edit the comment',

  RESOURCE_NOT_FOUND: 'Resource not found',
  USER_NOT_FOUND: 'User not found',
  CONVENTION_NOT_FOUND: 'Convention not found',
  PARENT_CATEGORY_NOT_FOUND: 'Parent category not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  CONVENTION_ITEM_NOT_FOUND: 'Convention item not found',
  CONVENTION_ITEM_VERSION_NOT_FOUND:
    'The version of the convention item does not exist',
  COMMENT_NOT_FOUND: 'Comment not found',

  RESOURCE_CONFLICTING: 'Field already exists',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  BASE_VERSION_OUT_DATED: 'The version that the edit is based on is outdated',

  UNNECESSARY_REQUEST: 'Unnecessary request',
  CANNOT_ROLLBACK_TO_CURRENT_VERSION: 'Cannot rollback to the current version',
  ITEM_VERSION_ALREADY_LIKED: 'You already liked the version of the item',
  ITEM_VERSION_NOT_LIKED_YET: "You haven't liked the version of the item yet",

  REGISTER_SUCCESS: 'You are all set!',
  LOGIN_SUCCESS: (username: string) => `Welcome, ${username}`,
  LOGOUT_SUCCESS: 'Successfully logged out',
  PASSWORDS_NOT_CONSISTENT: 'Password does not match the confirm password',
};
