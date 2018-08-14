import {observable} from 'mobx';

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
  deletedAt?: number;
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
  createdAt?: Date;
  deletedAt?: Date;
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
  commentCount: number;
  thumbUpCount: number;
  createdAt: Date;
  deletedAt?: Date;
  status: number;
}

export interface ConventionCache {
  [key: number]: Convention;
}

export interface ConventionContentCache {
  [key: number]: ConventionItem[];
}

export class ConventionStore {
  @observable
  index: ConventionIndexNode[];

  @observable
  conventionCache: ConventionCache = {};

  @observable
  currentConvention?: Convention;

  @observable
  conventionContentCache: ConventionContentCache = {};

  @observable
  currentContent: ConventionItem[] = [];

  @observable
  currentId = 0;

  constructor() {
    this.index = [];
  }
}
