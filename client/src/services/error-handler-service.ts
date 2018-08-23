import {APIMiddleware, APIService} from './api-service';
import {UserService} from './user-service';

export class ErrorHandlerService {
  constructor(
    private apiService: APIService,
    private userService: UserService,
  ) {
    this.apiService.addMiddleware(this.authMiddleware);
  }

  authMiddleware: APIMiddleware = (result, next) => {
    if ('error' in result) {
      let {message} = result.error;

      if (message.indexOf('403') !== -1) {
        this.userService.clearCredentials();

        result.error.message = '登录状态已失效，请重新登录';
      }
    }

    next();
  };
}
