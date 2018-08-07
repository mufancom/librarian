import {action, computed, observable} from 'mobx';

export class AuthStore {
  @observable
  id: number;

  @observable
  avatar: string;

  @observable
  username: string;

  @observable
  role: number;

  constructor() {
    this.id = 0;
    this.role = 0;
    this.avatar = '';
    this.username = '';
  }

  @computed
  get isLoggedIn(): boolean {
    return this.id !== 0;
  }

  @action
  login(id: number, role: number, avatar: string | null, username: string) {
    this.id = id;
    this.role = role;
    this.avatar = avatar ? avatar : '';
    this.username = username;
  }
}
