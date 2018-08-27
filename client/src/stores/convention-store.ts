import {observable} from 'mobx';
import {Options} from 'prettier';

import {Bimap} from 'utils/common';
import {Heading} from 'utils/markdown';

export const ITEM_VERSION_PAGE_SIZE = 20;

export enum CategoryStatus {
  deleted,
  normal,
}

export interface Category {
  id: number;
  parentId: number;
  orderId: number;
  title: string;
  alias?: string;
  deletedAt?: string;
  status: CategoryStatus;
}

export enum ConventionStatus {
  deleted,
  normal,
}

export interface Convention {
  id: number;
  categoryId: number;
  orderId: number;
  title: string;
  alias?: string;
  createdAt?: string;
  deletedAt?: string;
  status: ConventionStatus;
}

export interface ConventionIndexCategoryNode {
  type: 'category';
  entry: Category;
  children: ConventionIndexNode[];
}

export interface ConventionIndexConventionNode {
  type: 'convention';
  entry: Convention;
  url: string | undefined;
}

export type ConventionIndexNode =
  | ConventionIndexCategoryNode
  | ConventionIndexConventionNode;

export interface ConventionItem {
  id: number;
  orderId: number;
  conventionId: number;
  content: string;
  versionId: number;
  versionHash: string;
  versionCreatedAt: string;
  commentCount: number;
  thumbUpCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  renderedHTML: string;
  status: number;
}

export interface ConventionItemVersion {
  id: number;
  conventionItemId: number;
  fromId: number;
  userId: number;
  content: string;
  message?: string;
  hash: string;
  commentCount: number;
  thumbUpCount: number;
  createdAt: string;
}

export interface ItemDraft {
  content: string;
  savedAt: string;
}

export interface EditItemDraftDict {
  [key: number]: ItemDraft;
}

export interface NewItemDraftDict {
  [key: number]: ItemDraft;
}

export interface ConventionCache {
  [key: number]: Convention;
}

export interface ConventionContent {
  headings: Heading[];
  items: ConventionItem[];
}

export interface ConventionContentCache {
  [key: number]: ConventionContent;
}

export interface ConventionItemVersionWithUserInfo {
  itemVersion: ConventionItemVersion;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface ItemVersionGroup {
  date: string;
  children: ConventionItemVersionWithUserInfo[];
}

export type PrettierConfig = Options;

export class ConventionStore {
  @observable
  index: ConventionIndexNode[] = [];

  @observable
  conventionCache: ConventionCache = {};

  @observable
  currentConvention?: Convention;

  @observable
  currentConventionHeadingTree: Heading[] = [];

  @observable
  conventionContentCache: ConventionContentCache = {};

  @observable
  currentContent: ConventionContent | undefined;

  @observable
  currentVersionConventionItem?: ConventionItem;

  @observable
  currentVersionConvention: Convention | undefined;

  @observable
  currentVersionConventionPath: string | undefined;

  @observable
  currentVersionPage = 1;

  @observable
  versionGroups: ItemVersionGroup[] = [];

  @observable
  versionPageCount: number = 1;

  @observable
  newItemDraftDict: NewItemDraftDict = {};

  @observable
  editItemDraftDict: EditItemDraftDict = {};

  @observable
  prettierConfig: PrettierConfig | undefined;

  pathMap = new Bimap<string, string>();
}
