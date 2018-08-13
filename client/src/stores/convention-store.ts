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
  detetedAt?: number;
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
  createdAt?: number;
  deletedAt?: number;
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

export interface ConventionCache {
  [key: number]: string;
}

export class ConventionStore {
  @observable
  index: ConventionIndexNode[];

  @observable
  conventionCache: ConventionCache = {};

  @observable
  currentContent = '';

  @observable
  currentId = 0;

  constructor() {
    this.index = [];
  }
}
