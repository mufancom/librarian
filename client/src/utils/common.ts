class Bimap<K, V> extends Map<K, V> {
  private valueKeyMap = new Map<V, K>();

  clear(): void {
    super.clear();
    this.valueKeyMap.clear();
  }

  delete(key: K): boolean {
    let value = super.get(key);

    if (value && this.valueKeyMap.delete(value) && super.delete(key)) {
      return true;
    }

    return false;
  }

  deleteByValue(value: V): boolean {
    let key = this.valueKeyMap.get(value);

    if (key && super.delete(key) && this.valueKeyMap.delete(value)) {
      return true;
    }

    return false;
  }

  set(key: K, value: V): this {
    let oldValue = super.get(key);

    if (oldValue) {
      this.valueKeyMap.delete(oldValue);
    }

    let oldKey = this.valueKeyMap.get(value);

    if (oldKey) {
      super.delete(oldKey);
    }

    super.set(key, value);
    this.valueKeyMap.set(value, key);

    return this;
  }

  getKeyByValue(value: V): K | undefined {
    return this.valueKeyMap.get(value);
  }

  hasValue(value: V): boolean {
    return this.valueKeyMap.has(value);
  }
}
