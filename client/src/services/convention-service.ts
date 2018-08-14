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
    this.getIndex().catch();
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
  async getContent(id: number) {
    let cacheStore = this.conventionStore.conventionContentCache;

    if (cacheStore.hasOwnProperty(id)) {
      return cacheStore[id];
    }

    let content = await this.apiService.get<ConventionItem[]>(
      `convention/${id}/items`,
    );

    cacheStore[id] = content;
    return content;
  }
}
