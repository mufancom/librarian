import {
  IReactComponent,
  inject as _inject,
  observer as _observer,
} from 'mobx-react';
import {Component} from 'react';

export function inject(key: string): PropertyDecorator;
export function inject(target: Component, key: string): any;
export function inject(target: Component | string, key?: string): any {
  if (typeof target === 'string') {
    let name = target;

    return (prototype: Component, key: string): any =>
      decorate(prototype, key, name);
  } else if (key) {
    return decorate(target, key, key);
  } else {
    throw new Error('Invalid usage');
  }

  function decorate(target: any, _key: string, name: string): any {
    pushStore(target, name);

    return {
      get(this: any): any {
        return this.props[name];
      },
    };
  }
}

export function context(name: string): PropertyDecorator {
  return (target: any) => {
    pushStore(target, 'context');

    return {
      get(this: any): any {
        return this.props.context[name];
      },
    };
  };
}

function pushStore(target: any, name: string): void {
  if (target._stores) {
    target._stores.push(name);
  } else {
    Object.defineProperty(target, '_stores', {
      value: [name],
    });
  }
}

export function observer<T extends IReactComponent>(target: T): T {
  target = _observer(target) || target;

  let stores = target.prototype._stores;

  if (stores) {
    target = _inject(...stores)(target) || target;
  }

  return target;
}
