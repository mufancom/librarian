import {I18nResolver} from 'i18n-ts';

const defaultEn = {
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
  usernameLengthException: 'Username should be 4-20 characters long',
  passwordLengthException: 'Password should be 8-48 characters long',
};

type Translation = typeof defaultEn & {[key: string]: string};

const zh: Translation = {
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
  usernameLengthException: '用户名长度应为4-20位',
  passwordLengthException: '密码长度应为8-48位',
};

export const i18n = {
  default: defaultEn,
  defaultEn,
  zh,
};

function getAcceptableLang(langs: ReadonlyArray<string>) {
  for (let lang of langs) {
    lang = lang.replace(/-(\w)/g, (_all, letter) => letter.toUpperCase());
    if (i18n.hasOwnProperty(lang)) {
      return lang;
    }
  }
  return 'default';
}

export const CURRENT_LANG = getAcceptableLang(navigator.languages);

export const translation = new I18nResolver<Translation>(i18n, CURRENT_LANG)
  .translation;
