import {RouterStore} from 'mobx-react-router';

import {AuthStore} from 'stores/auth-store';
import {ConventionIndexStore} from 'stores/convention-index-store';

export const routerStore = new RouterStore();

export const authStore = new AuthStore();

export const conventionIndexStore = new ConventionIndexStore();
