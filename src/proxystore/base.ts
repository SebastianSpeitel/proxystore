import DeepProxy from "../DeepProxy";

export default class BaseProxyStore<
  T extends object = any
> extends DeepProxy<T> {
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
    this.set([], BaseProxyStore.ROOT);
  }
}
