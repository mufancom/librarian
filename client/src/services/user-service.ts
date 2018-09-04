import md5 from 'md5';
import {action} from 'mobx';

import {RegisterInvitation} from 'components/home';
import {AuthStore} from 'stores/auth-store';

import {APIService} from './api-service';

const DEFAULT_AVATAR = encodeURI('none');

interface LoginSuccessData {
  id: number;
  role: number;
  username: string;
  avatar: string | null;
  email: string;
  registerInvitationEnabled: boolean;
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
  async checkStatus(): Promise<void> {
    try {
      const data = await this.apiService.get<CheckStatusSuccessData>(
        'auth/check',
      );

      this.authStore.id = data.id;
      this.authStore.role = data.role;
      this.authStore.username = data.username;
      this.authStore.email = data.email;
      this.authStore.avatar = this.getAvatarUrl(data.email);
      this.authStore.registerInvitationEnabled = data.registerInvitationEnabled;
    } catch (error) {}
  }

  @action
  async login(username: string, password: string): Promise<string> {
    const data = await this.apiService.post<LoginSuccessData>('auth/login', {
      username,
      password,
    });

    this.authStore.id = data.id;
    this.authStore.role = data.role;
    this.authStore.username = data.username;
    this.authStore.email = data.email;
    this.authStore.avatar = this.getAvatarUrl(data.email);
    this.authStore.registerInvitationEnabled = data.registerInvitationEnabled;

    return data.username;
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.apiService.post<any>('user/register', {
      username,
      email,
      password,
    });
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.apiService.post('user/change-password', {
      oldPassword,
      newPassword,
    });
  }

  @action
  async logout(): Promise<void> {
    await this.apiService.get<any>('auth/logout');

    this.clearCredentials();
  }

  @action
  clearCredentials(): void {
    this.authStore.id = 0;
    this.authStore.role = 0;
    this.authStore.username = '';
    this.authStore.email = '';
    this.authStore.avatar = '';
  }

  getEmailHash(email: string): string {
    return md5(email);
  }

  getAvatarUrl(email: string): string {
    let emailHash = this.getEmailHash(email);

    return `https://secure.gravatar.com/avatar/${emailHash}?d=${DEFAULT_AVATAR}`;
  }

  getAvatarProfileUrl(email: string): string {
    let emailHash = this.getEmailHash(email);

    return `https://en.gravatar.com/${emailHash}`;
  }

  async generateInvitation(email: string): Promise<void> {
    await this.apiService.post('user/generate-invitation', {email});
  }

  async grantRegisterWithInvitation(code: string): Promise<RegisterInvitation> {
    return this.apiService.get<RegisterInvitation>(
      `user/grant-register?hash=${code}`,
    );
  }

  async registerWithInvitation(
    username: string,
    password: string,
  ): Promise<void> {
    await this.apiService.post('user/register-with-invitation', {
      username,
      password,
    });
  }
}
