export interface Translation {
  /* Invalid arguments */
  INVALID_ARGUMENTS: string;

  /* Validation failed */
  VALIDATION_FAILED: string;
  USERNAME_LENGTH_EXCEPTION: string;
  PASSWORD_LENGTH_EXCEPTION: string;
  INVALID_EMAIL_EXCEPTION: string;
  INVALID_PAGE_NUMBER: string;

  /* Authentication failed */
  AUTHENTICATION_FAILED: string;
  USERNAME_PASSWORD_MISMATCH: string;
  NO_ACCESS_TO_CURRENT_COMMENT: string;

  /* Resource not found */
  RESOURCE_NOT_FOUND: string;
  USER_NOT_FOUND: string;
  CONVENTION_NOT_FOUND: string;
  PARENT_CATEGORY_NOT_FOUND: string;
  CATEGORY_NOT_FOUND: string;
  CONVENTION_ITEM_NOT_FOUND: string;
  CONVENTION_ITEM_VERSION_NOT_FOUND: string;
  COMMENT_NOT_FOUND: string;

  /* Resource conflicting */
  RESOURCE_CONFLICTING: string;
  USERNAME_ALREADY_EXISTS: string;
  EMAIL_ALREADY_EXISTS: string;
  BASE_VERSION_OUT_DATED: string;

  /* Unnecessary request */
  UNNECESSARY_REQUEST: string;
  CANNOT_ROLLBACK_TO_CURRENT_VERSION: string;
  ITEM_VERSION_ALREADY_LIKED: string;
  ITEM_VERSION_NOT_LIKED_YET: string;

  /* UI Notice */
  REGISTER_SUCCESS: string;
  LOGIN_SUCCESS: (username: string) => string;
  LOGOUT_SUCCESS: string;
  PASSWORDS_NOT_CONSISTENT: string;
}
