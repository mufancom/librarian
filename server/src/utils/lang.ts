import {I18nResolver} from 'i18n-ts';

const en = {
  invalidArguments: 'Invalid arguments',
  validationFailed: 'Validation failed',
  authenticationFailed: 'Authentication failed',
  resourceNotFound: 'Resource not found',
  userNotFound: 'User not found',
  conventionNotFound: 'Convention not found',
  usernamePasswordMismatch: 'Username and password mismatch',
  fieldAlreadyExists: 'Field already exists',
  usernameAlreadyExists: 'Username already exists',
  emailAlreadyExists: 'Email already exists',
};

const zh = {
  invalidArguments: '无效参数',
  validationFailed: '验证失败',
  authenticationFailed: '授权失败',
  resourceNotFound: '资源不存在',
  userNotFound: '用户不存在',
  conventionNotFound: '规范不存在',
  usernamePasswordMismatch: '用户名或密码错误',
  fieldAlreadyExists: '字段已经存在',
  usernameAlreadyExists: '用户名已经被占用',
  emailAlreadyExists: '邮箱已经注册过',
};

export type Translation = typeof en;

export const i18n = {
  default: en,
  en,
  zh,
};
