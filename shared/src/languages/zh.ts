import {Translation} from '../translation';

export const zh: Translation = {
  INVALID_ARGUMENTS: '无效参数',

  VALIDATION_FAILED: '验证失败',
  USERNAME_LENGTH_EXCEPTION: '用户名长度应为4-20位',
  PASSWORD_LENGTH_EXCEPTION: '密码长度应为8-48位',
  INVALID_EMAIL_EXCEPTION: '请输入有效的邮箱地址',
  INVALID_PAGE_NUMBER: '请提交有效的页数',

  AUTHENTICATION_FAILED: '授权失败',
  USERNAME_PASSWORD_MISMATCH: '用户名或密码错误',
  NO_ACCESS_TO_CURRENT_COMMENT: '没有权限修改当前评论',

  RESOURCE_NOT_FOUND: '资源不存在',
  USER_NOT_FOUND: '用户不存在',
  CONVENTION_NOT_FOUND: '规范不存在',
  PARENT_CATEGORY_NOT_FOUND: '父级类别不存在',
  CATEGORY_NOT_FOUND: '类别不存在',
  CONVENTION_ITEM_NOT_FOUND: '规范条目不存在',
  CONVENTION_ITEM_VERSION_NOT_FOUND: '不存在该规范条目版本',
  COMMENT_NOT_FOUND: '评论不存在',

  RESOURCE_CONFLICTING: '资源冲突',
  USERNAME_ALREADY_EXISTS: '用户名已经被占用',
  EMAIL_ALREADY_EXISTS: '邮箱已经注册过',
  BASE_VERSION_OUT_DATED: '修改所基于的版本已过期',

  UNNECESSARY_REQUEST: '无用访问',
  CANNOT_ROLLBACK_TO_CURRENT_VERSION: '不能回滚到当前版本',
  ITEM_VERSION_ALREADY_LIKED: '已点赞过该版本',
  ITEM_VERSION_NOT_LIKED_YET: '还未点赞过该版本',

  REGISTER_SUCCESS: '注册成功！',
  LOGIN_SUCCESS: (username: string) => `欢迎回来, ${username}`,
  LOGOUT_SUCCESS: '退出账号成功',
  PASSWORDS_NOT_CONSISTENT: '两次输入密码不一致',
};
