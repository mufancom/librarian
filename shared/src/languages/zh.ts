import {Translation} from 'translation';

export const zh: Translation = {
  INVALID_ARGUMENTS: '无效参数',
  VALIDATION_FAILED: '验证失败',
  AUTHENTICATION_FAILED: '授权失败',
  RESOURCE_NOT_FOUND: '资源不存在',
  USER_NOT_FOUND: '用户不存在',
  CONVENTION_NOT_FOUND: '规范不存在',
  USERNAME_PASSWORD_MISMATCH: '用户名或密码错误',
  RESOURCE_CONFLICTING: '资源冲突',
  USERNAME_ALREADY_EXISTS: '用户名已经被占用',
  EMAIL_ALREADY_EXISTS: '邮箱已经注册过',
  USERNAME_LENGTH_EXCEPTION: '用户名长度应为4-20位',
  PASSWORD_LENGTH_EXCEPTION: '密码长度应为8-48位',
  INVALID_EMAIL_EXCEPTION: '请输入有效的邮箱地址',
  REGISTER_SUCCESS: '注册成功！',
  LOGIN_SUCCESS: (username: string) => `欢迎回来, ${username}`,
  LOGOUT_SUCCESS: '退出账号成功',
  PASSWORDS_NOT_CONSISTENT: '两次输入密码不一致',
  UNNECESSARY_REQUEST: '无效访问',
};
