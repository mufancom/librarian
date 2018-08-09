import {observable} from 'mobx';

export interface ConventionIndexTree {
  title: string;
  path?: string;
  children?: ConventionIndexTree[];
}

export interface ConventionCache {
  [key: string]: string;
}

export class ConventionStore {
  @observable
  index: ConventionIndexTree[];

  @observable
  conventionCache: ConventionCache = {};

  @observable
  currentContent = '';

  @observable
  currentPath = '';

  constructor() {
    this.index = [
      {
        title: 'Typescript',
        children: [
          {
            title: '前端',
            children: [
              {
                title: '编码规范',
                path: '/convention/typescript/frontend/coding',
              },
              {
                title: '包管理',
                path: '/convention/typescript/frontend/package',
              },
              {
                title: 'React',
                path: '/convention/typescript/frontend/react',
              },
            ],
          },
          {
            title: '后端',
            children: [
              {
                title: '编码规范',
                path: '/convention/typescript/backend/coding',
              },
              {
                title: '包管理',
                path: '/convention/typescript/backend/package',
              },
              {
                title: 'NodeJs',
                path: '/convention/typescript/backend/nodejs',
              },
            ],
          },
        ],
      },
      {
        title: 'Java',
        children: [
          {
            title: '编码规范',
            path: '/convention/java/coding',
          },
          {
            title: 'maven使用',
            path: '/convention/java/maven',
          },
          {
            title: 'Spring相关',
            path: '/convention/java/spring',
          },
          {
            title: 'Hibernate相关',
            path: '/convention/java/hibernate',
          },
        ],
      },
    ];
  }
}
