import {Translation} from 'utils/lang';

export const zh: Translation = {
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
  emailIsEmailException: '请输入有效的邮箱地址',
  registerSuccess: '注册成功！',
  loginSuccess: (username: string) => `欢迎回来, ${username}`,
  logoutSuccess: '退出账号成功',
  passwordsNotConsistent: '两次输入密码不一致',
};
