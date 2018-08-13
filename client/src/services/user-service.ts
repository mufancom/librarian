import {action} from 'mobx';
import {AuthStore} from 'stores/auth-store';
import {APIService} from './api-service';

interface LoginSuccessData {
  id: number;
  role: number;
  username: string;
  avatar: string | null;
  email: string;
}

interface CheckStatusSuccessData extends LoginSuccessData {}

export class UserService {
  constructor(
    private readonly apiService: APIService,
    private readonly authStore: AuthStore,
  ) {
    // tslint:disable-next-line:no-console
    this.checkStatus().catch(console.error);
  }

  @action
  async checkStatus() {
    try {
      const data = await this.apiService.get<CheckStatusSuccessData>(
        'auth/check',
      );

      this.authStore.id = data.id;
      this.authStore.role = data.role;
      this.authStore.username = data.username;
      this.authStore.avatar = data.avatar ? data.avatar : '';
    } catch (error) {}
  }

  @action
  async login(username: string, password: string) {
    const data = await this.apiService.post<LoginSuccessData>('auth/login', {
      username,
      password,
    });

    this.authStore.id = data.id;
    this.authStore.role = data.role;
    this.authStore.username = data.username;
    this.authStore.avatar = data.avatar ? data.avatar : '';

    return data.username;
  }

  async register(username: string, email: string, password: string) {
    await this.apiService.post<any>('user/register', {
      username,
      email,
      password,
    });
  }

  @action
  async logout() {
    await this.apiService.get<any>('auth/logout');

    this.authStore.id = 0;
    this.authStore.role = 0;
    this.authStore.username = '';
    this.authStore.avatar = '';
  }
}
