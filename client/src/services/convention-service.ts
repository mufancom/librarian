import {action} from 'mobx';
import {CursorOptions, CursorResult} from 'prettier';

import {
  Category,
  Convention,
  ConventionContent,
  ConventionIndexCategoryNode,
  ConventionIndexNode,
  ConventionItem,
  ConventionItemVersionWithUserInfo,
  ConventionStore,
  EditItemDraftDict,
  ItemDraft,
  ItemVersionGroup,
  NewItemDraftDict,
  PrettierConfig,
} from 'stores/convention-store';
import {Heading, mark, prettify, prettifyWithCursor} from 'utils/markdown';

import {APIService} from './api-service';

export interface RouteIdMatchParams {
  id: number;
}

export interface RouteThreeLevelParams {
  category: string;
  group: string;
  item: string;
}

export interface RouteTwoLevelParams {
  category: string;
  group: '-';
  item: string;
}

export type RouteAliasParams = RouteThreeLevelParams | RouteTwoLevelParams;

export type RouteParams = RouteIdMatchParams | RouteAliasParams;

export type VersionsRouteParams = RouteAliasParams & {
  itemId: number;
};

export interface GetConventionItemVersionsData {
  versions: ConventionItemVersionWithUserInfo[];
  pageCount: number;
}

const FALLBACK_PRETTIER_CONFIG: PrettierConfig = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
};

export function isRouteAliasParams(value: any): value is RouteAliasParams {
  return (
    typeof value === 'object' &&
    'category' in value &&
    'group' in value &&
    'item' in value
  );
}

export function isRouteIdMatchParams(
  params: RouteParams,
): params is RouteIdMatchParams {
  return typeof params === 'object' && 'id' in params;
}

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

function generateUrl(
  convention: Convention,
  categoryMap: Map<number, ConventionIndexCategoryNode>,
): string | undefined {
  let names = [];

  let {alias, title} = convention;

  names.push(alias ? alias : title);

  let parentCategoryId = convention.categoryId;

  while (parentCategoryId) {
    let category = categoryMap.get(parentCategoryId);

    if (!category) {
      return undefined;
    }

    let {title, alias, parentId} = category.entry;

    names.push(alias ? alias : title);

    parentCategoryId = parentId;
  }

  let url = '';

  for (let [index, name] of names.entries()) {
    let onlyTwoParams = names.length === 2 && index === 1;

    url = `${name}${onlyTwoParams ? '/-' : ''}/${url}`;
  }

  return url;
}

function buildIndexTree(
  categories: Category[],
  conventions: Convention[],
  urlMap: Map<string, string>,
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

    let url = generateUrl(convention, categoryMap);

    if (url) {
      urlMap.set(url, JSON.stringify(convention));
    }

    insertIntoSortedSiblings(siblings, {
      type: 'convention',
      entry: convention,
      url,
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
    let {conventionStore} = this;

    if (
      !conventionStore.currentConvention ||
      conventionStore.currentConvention.id !== id
    ) {
      this.getConvention(id)
        .then(value => {
          conventionStore.currentConvention = value;
        })
        .catch();
      conventionStore.currentContent = await this.getContent(id);
    }
  }

  @action
  async getIndex(): Promise<void> {
    let {categories, conventions} = await this.apiService.get<
      GetIndexSuccessData
    >('convention/index');

    this.conventionStore.index = buildIndexTree(
      categories,
      conventions,
      this.conventionStore.pathMap,
    );
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
  ): Promise<ConventionContent> {
    let cacheStore = this.conventionStore.conventionContentCache;

    if (cacheStore.hasOwnProperty(id) && cached) {
      return cacheStore[id];
    }

    let content = await this.apiService.get<ConventionItem[]>(
      `convention/${id}/items`,
    );

    let combinedHeadingTree: Heading[] = [];

    for (let [index, item] of content.entries()) {
      let {html, headingTree} = mark(item.content, true, index + 1);

      combinedHeadingTree = combinedHeadingTree.concat(headingTree);

      item.renderedHTML = html;
    }

    let conventionContent = {
      items: content,
      headings: combinedHeadingTree,
    };

    cacheStore[id] = conventionContent;
    return conventionContent;
  }

  async createCategory(
    parentId: number,
    title: string,
    alias?: string,
    afterOrderId?: number,
  ): Promise<void> {
    await this.apiService.post('convention/category/create', {
      title,
      parentId,
      alias,
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

  async editCategoryAlias(id: number, alias: string): Promise<void> {
    await this.apiService.post('convention/category/edit', {
      id,
      alias,
    });

    await this.getIndex();
  }

  async deleteCategory(id: number): Promise<void> {
    await this.apiService.get(`convention/category/${id}/delete`);

    await this.getIndex();
  }

  async getConventionByPath(path: string): Promise<Convention | undefined> {
    if (this.conventionStore.index.length === 0) {
      await this.getIndex();
    }

    let objStr = this.conventionStore.pathMap.get(path);

    if (objStr) {
      return JSON.parse(objStr) as Convention;
    }

    return undefined;
  }

  async getPathByConvention(
    convention: Convention,
  ): Promise<string | undefined> {
    if (this.conventionStore.index.length === 0) {
      await this.getIndex();
    }

    return this.conventionStore.pathMap.getKeyByValue(
      JSON.stringify(convention),
    );
  }

  async getConventionByPathParams(
    category: string,
    group: string,
    item: string,
  ): Promise<Convention | undefined>;
  async getConventionByPathParams(
    params: RouteParams,
  ): Promise<Convention | undefined>;
  async getConventionByPathParams(
    category: string | RouteParams,
    group?: string,
    item?: string,
  ): Promise<Convention | undefined> {
    if (isRouteAliasParams(category)) {
      ({category, group, item} = category);
    }

    let path = `${category}/${group}/${item}/`;

    return this.getConventionByPath(path);
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
    alias?: string,
    afterOrderId?: number,
  ): Promise<void> {
    await this.apiService.post('convention/create', {
      categoryId,
      title,
      alias,
      afterOrderId,
    });

    await this.getIndex();
  }

  async deleteConvention(id: number): Promise<void> {
    await this.apiService.get(`convention/${id}/delete`);

    await this.getIndex();
  }

  async shiftConvention(id: number, afterOrderId: number): Promise<void> {
    await this.apiService.post('convention/edit', {id, afterOrderId});

    await this.getIndex();
  }

  async renameConvention(id: number, title: string): Promise<void> {
    await this.apiService.post('convention/edit', {id, title});

    await this.getIndex();

    await this.freshConvention(id);
  }

  async editConventionAlias(id: number, alias: string): Promise<void> {
    await this.apiService.post('convention/edit', {id, alias});

    await this.getIndex();
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

  async getConventionItem(
    conventionItemId: number,
  ): Promise<ConventionItem | undefined> {
    return this.apiService.get<ConventionItem>(
      `convention/item/${conventionItemId}`,
    );
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

  async getConventionItemVersions(
    conventionItemId: number,
    page: number,
  ): Promise<GetConventionItemVersionsData> {
    return this.apiService.get<GetConventionItemVersionsData>(
      `convention/item/${conventionItemId}/versions?page=${page}`,
    );
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
  async loadVersions(params: VersionsRouteParams, page: number): Promise<void> {
    let {itemId} = params;

    this.conventionStore.versionGroups = [];

    let convention = await this.getConventionByPathParams(params);

    let item = await this.getConventionItem(itemId);

    if (convention && item) {
      let conventionStore = this.conventionStore;

      let data = await this.getConventionItemVersions(itemId, page);

      conventionStore.currentVersionConventionPath = await this.getPathByConvention(
        convention,
      );

      conventionStore.currentVersionConvention = convention;

      conventionStore.currentVersionConventionItem = item;

      conventionStore.currentVersionPage = page;

      conventionStore.versionGroups = buildVersionGroups(data.versions);

      conventionStore.versionPageCount = data.pageCount;
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

function buildVersionGroups(
  versions: ConventionItemVersionWithUserInfo[],
): ItemVersionGroup[] {
  let result: ItemVersionGroup[] = [];

  let lastDate: string = '';

  let nowGroupIndex: number = -1;

  for (let version of versions) {
    // tslint:disable-next-line:no-console
    console.log(version.itemVersion);

    let date = new Date(version.itemVersion.createdAt);

    let dateStr = date.toLocaleDateString();

    if (lastDate === dateStr) {
      result[nowGroupIndex].children.push(version);
    } else if (dateStr) {
      nowGroupIndex++;

      let group: ItemVersionGroup = {
        date: dateStr,
        children: [version],
      };

      result[nowGroupIndex] = group;
      lastDate = dateStr;
    }
  }

  return result;
}
