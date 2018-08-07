import {APIService} from 'services/api-service';
import {UserService} from 'services/user-service';
import {authStore} from './stores';

export const apiService = new APIService();

export const userService = new UserService(apiService, authStore);
