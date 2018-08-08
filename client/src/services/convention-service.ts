import {action} from 'mobx';

import {ConventionIndexTree, ConventionStore} from 'stores/convention-store';
import {APIService} from './api-service';

type GetIndexSuccessData = ConventionIndexTree[];

export class ConventionService {
  constructor(
    private readonly apiService: APIService,
    private readonly conventionStore: ConventionStore,
  ) {
    this.getIndex().catch();
  }

  test() {
    this.apiService.get<any>('haha').catch();
    alert(this.conventionStore.index);
  }

  @action
  async getIndex() {
    this.conventionStore.index = await this.apiService.get<GetIndexSuccessData>(
      'convention/index',
    );
  }
}
