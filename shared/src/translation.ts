export interface Translation {
  /* Invalid arguments */
  INVALID_ARGUMENTS: string;

  /* Validation failed */
  VALIDATION_FAILED: string;
  USERNAME_LENGTH_EXCEPTION: string;
  PASSWORD_LENGTH_EXCEPTION: string;
  INVALID_EMAIL_EXCEPTION: string;
  INVALID_PAGE_NUMBER: string;
  EMAIL_ISEMAIL_EXCEPTION: string;
  AFTER_ORDER_ID_MIN_EXCEPTION: string;
  TITLE_LENGTH_EXCEPTION: string;
  ALIAS_LENGTH_EXCEPTION: string;
  CONTENT_MINLENGTH_EXCEPTION: string;
  TITLE_MATCHES_EXCEPTION: string;
  ALIAS_MATCHES_EXCEPTION: string;

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
  TITLE_ALREADY_EXISTS_UNDER_SAME_PARENT: string;
  ALIAS_ALREADY_EXISTS_UNDER_SAME_PARENT: string;

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

  /* Timeago.js Date transform */
  TIMEAGO_JUST_NOW: string;
  TIMEAGO_A_WHILE: string;
  TIMEAGO_SECONDS_AGO: string;
  TIMEAGO_IN_SECONDS: string;
  TIMEAGO_1_MINUTE_AGO: string;
  TIMEAGO_IN_1_MINUTE: string;
  TIMEAGO_MINUTES_AGO: string;
  TIMEAGO_IN_MINUTES: string;
  TIMEAGO_1_HOUR_AGO: string;
  TIMEAGO_IN_1_HOUR: string;
  TIMEAGO_HOURS_AGO: string;
  TIMEAGO_IN_HOURS: string;
  TIMEAGO_1_DAY_AGO: string;
  TIMEAGO_IN_1_DAY: string;
  TIMEAGO_DAYS_AGO: string;
  TIMEAGO_IN_DAYS: string;
  TIMEAGO_1_WEEK_AGO: string;
  TIMEAGO_IN_1_WEEK: string;
  TIMEAGO_WEEKS_AGO: string;
  TIMEAGO_IN_WEEKS: string;
  TIMEAGO_1_MONTH_AGO: string;
  TIMEAGO_IN_1_MONTH: string;
  TIMEAGO_MONTHS_AGO: string;
  TIMEAGO_IN_MONTHS: string;
  TIMEAGO_1_YEAR_AGO: string;
  TIMEAGO_IN_1_YEAR: string;
  TIMEAGO_YEARS_AGO: string;
  TIMEAGO_IN_YEARS: string;
}
