import IOHandler from "./io/IOHandler";
import DeepProxy from "./DeepProxy";

export interface ProxyStoreOptions<T extends object> {
  init?: T | boolean;
}

export default class ProxyStore<T extends object = object> extends DeepProxy<
  T
> {
  public declare readonly proxy: T;
  public declare handler: IOHandler<T>;

  constructor(
    paramHandler: string | IOHandler<T>,
    { init = true }: ProxyStoreOptions<T> = {}
  ) {
    let handler: IOHandler<T>;
    if (typeof paramHandler === "string") {
      throw TypeError("Handler string not implemented yet");
    } else {
      handler = paramHandler;
    }
    let root: T;
    if (!init) {
      root = {} as T;
    } else if (init === true) {
      root = handler.load();
    } else if (typeof init === "object") {
      root = init;
    } else {
      throw TypeError("Invalid type of init option");
    }
    super(root);

    this.handler = handler;
  }

  save() {
    this.handler.save(this._root as T);
  }

  load() {
    this._root = this.handler.load();
  }

  //@ts-ignore
  set(path: PropertyKey[], prop: PropertyKey, val: any) {
    const ret = super.set(path, prop, val);
    this.save();
    return ret;
  }

  //@ts-ignore
  deleteProperty(path: PropertyKey[], prop: PropertyKey) {
    const ret = super.deleteProperty(path, prop);
    this.save();
    return ret;
  }
}
