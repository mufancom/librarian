import {action} from 'mobx';
import {CursorOptions, CursorResult} from 'prettier';

import {
  Category,
  Convention,
  ConventionIndexCategoryNode,
  ConventionIndexNode,
  ConventionItem,
  ConventionStore,
  EditItemDraftDict,
  ItemDraft,
  NewItemDraftDict,
  PrettierConfig,
} from 'stores/convention-store';
import {prettify, prettifyWithCursor} from 'utils/markdown';

import {APIService} from './api-service';

const FALLBACK_PRETTIER_CONFIG: PrettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
};

function isPositionAvailable(
  node: ConventionIndexNode,
  insertIndex: number,
  siblings: ConventionIndexNode[],
): boolean {
  let sibling = siblings[insertIndex];

  let {orderId} = node.entry;

  if (sibling) {
    if (node.type === 'category' && sibling.type === 'convention') {
      return false;
    } else if (node.type === 'convention' && sibling.type === 'category') {
      return true;
    } else if (orderId > sibling.entry.orderId) {
      return false;
    }

    return true;
  } else {
    return true;
  }
}

function insertIntoSortedSiblings<T extends ConventionIndexNode>(
  siblings: T[],
  node: T,
): void {
  let insertIndex = 0;

  while (!isPositionAvailable(node, insertIndex, siblings)) {
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

  // create mapping for categories
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

    let {parentId} = entry;

    let siblings = result;

    if (parentId) {
      if (!categoryMap.has(parentId)) {
        continue;
      }

      siblings = categoryMap.get(parentId)!.children;
    }

    insertIntoSortedSiblings(siblings, node);
  }

  for (let convention of conventions) {
    let {categoryId} = convention;

    if (!categoryMap.has(categoryId)) {
      continue;
    }

    let siblings = categoryMap.get(categoryId)!.children;

    insertIntoSortedSiblings(siblings, {
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
    this.getNewItemDraftDict();
    this.getItemDraftDict();

    // tslint:disable-next-line:no-console
    this.getIndex().catch(console.error);
  }

  @action
  async load(id: number): Promise<void> {
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
  async getConvention(id: number): Promise<Convention> {
    let conventionStore = this.conventionStore.conventionCache;

    if (conventionStore.hasOwnProperty(id)) {
      return conventionStore[id];
    }

    let convention = await this.apiService.get<Convention>(`convention/${id}`);

    conventionStore[id] = convention;
    return convention;
  }

  @action
  async getContent(
    id: number,
    cached: boolean = true,
  ): Promise<ConventionItem[]> {
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

  async createCategory(
    parentId: number,
    title: string,
    afterOrderId?: number,
  ): Promise<void> {
    await this.apiService.post('convention/category/create', {
      title,
      parentId,
      afterOrderId,
    });

    await this.getIndex();
  }

  async shiftCategory(id: number, afterOrderId: number): Promise<void> {
    await this.apiService.post('convention/category/edit', {
      id,
      afterOrderId,
    });

    await this.getIndex();
  }

  async renameCategory(id: number, title: string): Promise<void> {
    await this.apiService.post('convention/category/edit', {
      id,
      title,
    });

    await this.getIndex();
  }

  async deleteCategory(id: number): Promise<void> {
    await this.apiService.get(`convention/category/${id}/delete`);

    await this.getIndex();
  }

  @action
  async freshConvention(id: number): Promise<void> {
    let conventionCache = this.conventionStore.conventionCache;

    if (id in conventionCache) {
      let convention = await this.apiService.get<Convention>(
        `convention/${id}`,
      );

      conventionCache[id] = convention;

      let current = this.conventionStore.currentConvention;

      if (current && current.id === id) {
        this.conventionStore.currentConvention = convention;
      }
    }
  }

  async createConvention(
    categoryId: number,
    title: string,
    afterOrderId?: number,
  ): Promise<void> {
    await this.apiService.post('convention/create', {
      categoryId,
      title,
      afterOrderId,
    });

    await this.getIndex();
  }

  async deleteConvention(id: number): Promise<void> {
    await this.apiService.get(`convention/${id}/delete`);

    await this.getIndex();
  }

  @action
  async shiftConvention(id: number, afterOrderId: number): Promise<void> {
    await this.apiService.post('convention/edit', {id, afterOrderId});

    await this.getIndex();
  }

  @action
  async renameConvention(id: number, title: string): Promise<void> {
    await this.apiService.post('convention/edit', {id, title});

    await this.getIndex();

    await this.freshConvention(id);
  }

  @action
  async freshCurrentConventionItems(conventionId: number): Promise<void> {
    this.conventionStore.currentContent = await this.getContent(
      conventionId,
      false,
    );
  }

  async createConventionItem(
    conventionId: number,
    content: string,
  ): Promise<void> {
    content = await this.prettify(content);

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
  ): Promise<void> {
    let {id, conventionId} = conventionItem;

    content = await this.prettify(content);

    await this.apiService.post('convention/item/edit', {
      id,
      fromVersionId,
      content,
    });

    await this.freshCurrentConventionItems(conventionId);
  }

  @action
  async getPrettierConfig(): Promise<PrettierConfig> {
    let {prettierConfig} = this.conventionStore;

    if (prettierConfig) {
      return prettierConfig;
    }

    try {
      let config = await this.apiService.get('convention/prettier-config');

      this.conventionStore.prettierConfig = config;

      return config;
    } catch (error) {
      return FALLBACK_PRETTIER_CONFIG;
    }
  }

  async prettify(markdown: string): Promise<string>;
  async prettify(markdown: string, cursorOffset: number): Promise<CursorResult>;
  async prettify(
    markdown: string,
    cursorOffset?: number,
  ): Promise<string | CursorResult> {
    let config = await this.getPrettierConfig();

    if (cursorOffset) {
      return prettifyWithCursor(
        markdown,
        cursorOffset,
        config as CursorOptions,
      );
    } else {
      return prettify(markdown, config);
    }
  }

  async shiftConventionItem(
    conventionItem: ConventionItem,
    afterOrderId: number,
  ): Promise<void> {
    let {id, conventionId} = conventionItem;

    await this.apiService.post('convention/item/shift', {
      id,
      afterOrderId,
    });

    await this.freshCurrentConventionItems(conventionId);
  }

  async deleteConventionItem(conventionItem: ConventionItem): Promise<void> {
    let {id, conventionId} = conventionItem;

    await this.apiService.get(`convention/item/${id}/delete`);

    await this.freshCurrentConventionItems(conventionId);
  }

  getEditConventionItemDraft(conventionItemId: number): ItemDraft | undefined {
    let {editItemDraftDict} = this.conventionStore;

    if (conventionItemId in editItemDraftDict) {
      return editItemDraftDict[conventionItemId];
    }

    return undefined;
  }

  @action
  saveEditConventionItemDraft(conventionItemId: number, content: string): void {
    let savedAt = new Date().toString();

    let draft = {content, savedAt} as ItemDraft;

    this.conventionStore.editItemDraftDict[conventionItemId] = draft;

    this.storeItemDraftDict();
  }

  @action
  deleteEditConventionItemDraft(conventionItemId: number): void {
    let {editItemDraftDict} = this.conventionStore;

    if (conventionItemId in editItemDraftDict) {
      delete editItemDraftDict[conventionItemId];

      this.storeItemDraftDict();
    }
  }

  @action
  getNewConventionItemDraft(conventionId: number): ItemDraft | undefined {
    let {newItemDraftDict} = this.conventionStore;

    if (conventionId in newItemDraftDict) {
      return newItemDraftDict[conventionId];
    }

    return undefined;
  }

  @action
  saveNewConventionItemDraft(conventionId: number, content: string): void {
    let savedAt = new Date().toString();

    let draft = {content, savedAt} as ItemDraft;

    this.conventionStore.newItemDraftDict[conventionId] = draft;

    this.storeNewItemDraftDict();
  }

  deleteNewConventionItemDraft(conventionId: number): void {
    let {newItemDraftDict} = this.conventionStore;

    if (conventionId in newItemDraftDict) {
      delete newItemDraftDict[conventionId];

      this.storeNewItemDraftDict();
    }
  }

  @action
  private getItemDraftDict(): void {
    let storeString = localStorage.getItem('convention_item_draft_dict');

    let store: EditItemDraftDict = {};

    if (storeString) {
      store = JSON.parse(storeString) as EditItemDraftDict;
    }

    this.conventionStore.editItemDraftDict = store;
  }

  private storeItemDraftDict(): void {
    let dictString = JSON.stringify(this.conventionStore.editItemDraftDict);

    localStorage.setItem('convention_item_draft_dict', dictString);
  }

  @action
  private getNewItemDraftDict(): void {
    let storeString = localStorage.getItem('convention_new_item_draft_dict');

    let store: NewItemDraftDict = {};

    if (storeString) {
      store = JSON.parse(storeString) as NewItemDraftDict;
    }

    this.conventionStore.newItemDraftDict = store;
  }

  private storeNewItemDraftDict(): void {
    let dictString = JSON.stringify(this.conventionStore.newItemDraftDict);

    localStorage.setItem('convention_new_item_draft_dict', dictString);
  }
}
