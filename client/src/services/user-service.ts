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

export class UserService {
  constructor(
    private readonly apiService: APIService,
    private readonly authStore: AuthStore,
  ) {}

  @action
  async login(username: string, password: string) {
    const data = await this.apiService.post<LoginSuccessData>('auth/login', {
      username,
      password,
    });

    this.authStore.id = data.id;
    this.authStore.username = data.username;
    this.authStore.avatar = data.avatar ? data.avatar : '';
    this.authStore.role = data.role;
  }
}
