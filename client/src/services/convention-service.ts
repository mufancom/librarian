import {action} from 'mobx';

import {
  Category,
  Convention,
  ConventionIndexCategoryNode,
  ConventionIndexNode,
  ConventionItem,
  ConventionStore,
} from 'stores/convention-store';
import {APIService} from './api-service';

function insertIntoSortedSiblings<T extends ConventionIndexNode>(
  siblings: T[],
  orderId: number,
  node: T,
) {
  let insertIndex = 0;

  while (
    siblings.length > insertIndex &&
    siblings[insertIndex].entry.orderId < orderId
  ) {
    insertIndex++;
  }

  siblings.splice(insertIndex, 0, node);
}

function buildIndexTree(
  categories: Category[],
  conventions: Convention[],
): ConventionIndexNode[] {
  let categoryMap = new Map<number, ConventionIndexCategoryNode>();

  let result: ConventionIndexNode[] = [];

  for (let category of categories) {
    let node: ConventionIndexCategoryNode = {
      type: 'category',
      entry: category,
      children: [],
    };
    categoryMap.set(category.id, node);
  }

  for (let node of categoryMap.values()) {
    let {entry} = node;

    let {parentId, orderId} = entry;

    let siblings = result;
    if (parentId) {
      if (!categoryMap.has(parentId)) {
        continue;
      }

      siblings = categoryMap.get(parentId)!.children;
    }

    insertIntoSortedSiblings(siblings, orderId, node);
  }

  for (let convention of conventions) {
    let {categoryId, orderId} = convention;

    if (!categoryMap.has(categoryId)) {
      continue;
    }

    let siblings = categoryMap.get(categoryId)!.children;

    insertIntoSortedSiblings(siblings, orderId, {
      type: 'convention',
      entry: convention,
    });
  }

  return result;
}

interface GetIndexSuccessData {
  categories: Category[];
  conventions: Convention[];
}

export class ConventionService {
  constructor(
    private apiService: APIService,
    private conventionStore: ConventionStore,
  ) {
    // tslint:disable-next-line:no-console
    this.getIndex().catch(console.error);
  }

  @action
  async load(id: number) {
    if (this.conventionStore.currentId !== id) {
      this.getConvention(id)
        .then(value => {
          this.conventionStore.currentConvention = value;
        })
        .catch();
      this.conventionStore.currentContent = await this.getContent(id);
    }
  }

  @action
  async getIndex(): Promise<void> {
    let {categories, conventions} = await this.apiService.get<
      GetIndexSuccessData
    >('convention/index');

    this.conventionStore.index = buildIndexTree(categories, conventions);
  }

  @action
  async getConvention(id: number) {
    let conventionStore = this.conventionStore.conventionCache;

    if (conventionStore.hasOwnProperty(id)) {
      return conventionStore[id];
    }

    let convention = await this.apiService.get<Convention>(`convention/${id}`);

    conventionStore[id] = convention;
    return convention;
  }

  @action
  async getContent(id: number, cached: boolean = true) {
    let cacheStore = this.conventionStore.conventionContentCache;

    if (cacheStore.hasOwnProperty(id) && cached) {
      return cacheStore[id];
    }

    let content = await this.apiService.get<ConventionItem[]>(
      `convention/${id}/items`,
    );

    cacheStore[id] = content;
    return content;
  }

  async createCategory(parentId: number, title: string, afterOrderId?: number) {
    await this.apiService.post('convention/category/create', {
      title,
      parentId,
      afterOrderId,
    });

    await this.getIndex();
  }

  async deleteCategory(id: number) {
    await this.apiService.get(`convention/category/${id}/delete`);

    await this.getIndex();
  }

  async shiftCategory(id: number, afterOrderId: number) {
    await this.apiService.post('convention/category/edit', {
      id,
      afterOrderId,
    });

    await this.getIndex();
  }

  async createConvention(
    categoryId: number,
    title: string,
    afterOrderId?: number,
  ) {
    await this.apiService.post('convention/create', {
      categoryId,
      title,
      afterOrderId,
    });

    await this.getIndex();
  }

  async deleteConvention(id: number) {
    await this.apiService.get(`convention/${id}/delete`);

    await this.getIndex();
  }

  @action
  async shiftConvention(id: number, afterOrderId: number) {
    await this.apiService.post('convention/edit', {id, afterOrderId});

    await this.getIndex();
  }

  @action
  async freshCurrentConventionItems(conventionId: number) {
    this.conventionStore.currentContent = await this.getContent(
      conventionId,
      false,
    );
  }

  async createConventionItem(conventionId: number, content: string) {
    await this.apiService.post('convention/item/create', {
      conventionId,
      content,
    });

    await this.freshCurrentConventionItems(conventionId);
  }

  async editConventionItem(
    conventionItem: ConventionItem,
    fromVersionId: number,
    content: string,
  ) {
    let {id, conventionId} = conventionItem;

    await this.apiService.post('convention/item/edit', {
      id,
      fromVersionId,
      content,
    });

    await this.freshCurrentConventionItems(conventionId);
  }

  async shiftConventionItem(
    conventionItem: ConventionItem,
    afterOrderId: number,
  ) {
    let {id, conventionId} = conventionItem;

    await this.apiService.post('convention/item/shift', {
      id,
      afterOrderId,
    });

    await this.freshCurrentConventionItems(conventionId);
  }

  async deleteConventionItem(conventionItem: ConventionItem) {
    let {id, conventionId} = conventionItem;

    await this.apiService.get(`convention/item/${id}/delete`);

    await this.freshCurrentConventionItems(conventionId);
  }
}
