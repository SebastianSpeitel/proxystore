import ProxyStoreBase from "./base";

interface Options {
  prefix?: string;
}

export default class ProxyStore<T extends object> extends ProxyStoreBase<T> {
  private declare prefix: string;

  constructor(root: T = {} as T, { prefix }: Options = {}) {
    super(root);
    this.prefix = prefix || "";
  }

  getKey(path: PropertyKey[], prop: PropertyKey) {
    return this.prefix + [...path, prop].join(".");
  }

  get(path: PropertyKey[], prop: PropertyKey) {
    const val = localStorage.getItem(this.getKey(path, prop));
    if (typeof val !== "string") return undefined;
    return JSON.parse(val);
  }

  //@ts-ignore
  set(path: PropertyKey[], prop: PropertyKey, val: any) {
    localStorage.setItem(this.getKey(path, prop), JSON.stringify(val));
    return true;
  }

  //@ts-ignore
  deleteProperty(path: PropertyKey[], prop: PropertyKey) {
    localStorage.removeItem(this.getKey(path, prop));
    return true;
  }
}
