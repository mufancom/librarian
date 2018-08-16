import {APIService} from 'services/api-service';
import {ConventionService} from 'services/convention-service';
import {ScrollService} from 'services/scroll-service';
import {UserService} from 'services/user-service';
import {authStore, conventionStore} from 'stores';

export const scrollService = new ScrollService();

export const apiService = new APIService();

export const userService = new UserService(apiService, authStore);

export const conventionService = new ConventionService(
  apiService,
  conventionStore,
);
