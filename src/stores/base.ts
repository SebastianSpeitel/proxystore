import DeepProxy from "../DeepProxy";

class BaseProxyStore<T extends object = any> extends DeepProxy<T> {
  static ROOT = Symbol("ProxyStore root");

  constructor(root: T = {} as T) {
    super(root);
  }

  get store(): T {
    return this.proxy;
  }

  set store(store: T) {
    // not 100% sure, this is safe
    this._root = store;
    this.set([], BaseProxyStore.ROOT, undefined);
  }
}
interface BaseProxyStore<T extends object> {
  new (root: T, options?: { [key: string]: any }): BaseProxyStore<T>;
}

export default BaseProxyStore;
