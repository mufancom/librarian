import {RouterStore} from 'mobx-react-router';

import {AuthStore} from 'stores/auth-store';
import {ConventionStore} from 'stores/convention-store';

export const routerStore = new RouterStore();

export const authStore = new AuthStore();

export const conventionStore = new ConventionStore();
