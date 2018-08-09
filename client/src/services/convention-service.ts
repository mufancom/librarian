import {action} from 'mobx';

import {ConventionIndexTree, ConventionStore} from 'stores/convention-store';
import {APIService} from './api-service';

type GetIndexSuccessData = ConventionIndexTree[];

export class ConventionService {
  constructor(
    private apiService: APIService,
    private conventionStore: ConventionStore,
  ) {
    this.getIndex().catch();
  }

  @action
  async load(path: string) {
    if (this.conventionStore.currentPath !== path) {
      this.conventionStore.currentContent = await this.getContent(path);
    }
  }

  @action
  async getIndex() {
    this.conventionStore.index = await this.apiService.get<GetIndexSuccessData>(
      'convention/index',
    );
  }

  @action
  async getContent(path: string) {
    let cacheStore = this.conventionStore.conventionCache;

    if (cacheStore.hasOwnProperty(path)) {
      return cacheStore[path];
    }

    let content = await this.apiService.download(`convention/${path}`);

    cacheStore[path] = content;
    return content;
  }
}
