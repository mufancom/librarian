import {action, computed, observable} from 'mobx';

export class AuthStore {
  @observable
  token: string;

  @observable
  id: number;

  @observable
  avatar: string;

  @observable
  username: string;

  constructor() {
    this.token = '';
    this.id = 0;
    this.avatar = '';
    this.username = '';
    this.fetchFromLocalStorage();
  }

  @computed
  get isLoggedIn(): boolean {
    return this.token !== '' && this.id !== 0;
  }

  saveToLocalStorage() {
    localStorage.setItem(
      'auth',
      JSON.stringify({
        id: this.id,
        token: this.token,
      }),
    );
  }

  @action
  fetchFromLocalStorage() {
    let {id = 0, token = ''} = JSON.parse(localStorage.getItem('auth') || '{}');
    this.id = id;
    this.token = token;
  }

  clearLocalStorage() {
    localStorage.removeItem('auth');
  }
}
