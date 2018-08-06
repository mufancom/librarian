import {observable} from 'mobx';

export interface IndexTree {
  title: string;
  url?: string;
  children?: IndexTree[];
}

export class ConventionIndexStore {
  @observable
  content: IndexTree[];

  constructor() {
    this.content = [
      {
        title: 'Typescript',
        children: [
          {
            title: '前端',
            children: [
              {
                title: '编码规范',
                url: '/convention/typescript/frontend/coding',
              },
              {
                title: '包管理',
                url: '/convention/typescript/frontend/package',
              },
              {
                title: 'React',
                url: '/convention/typescript/frontend/react',
              },
            ],
          },
          {
            title: '后端',
            children: [
              {
                title: '编码规范',
                url: '/convention/typescript/backend/coding',
              },
              {
                title: '包管理',
                url: '/convention/typescript/backend/package',
              },
              {
                title: 'NodeJs',
                url: '/convention/typescript/backend/nodejs',
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
            url: '/convention/java/coding',
          },
          {
            title: 'maven使用',
            url: '/convention/java/maven',
          },
          {
            title: 'Spring相关',
            url: '/convention/java/spring',
          },
          {
            title: 'Hibernate相关',
            url: '/convention/java/hibernate',
          },
        ],
      },
    ];
  }
}
