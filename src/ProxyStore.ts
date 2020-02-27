import IOHandler from "./io/IOHandler";

export interface ProxyStoreOptions<T extends object> {
  init?: T | boolean;
}

type HookKey = keyof ProxyHandler<any>;
const hookKeys = Object.getOwnPropertyNames(Reflect) as HookKey[];

type HookMap = {
  [hook in HookKey]?: (
    p: PropertyKey[],
    ...args: any[]
  ) => ReturnType<Required<ProxyHandler<any>>[hook]>;
};

abstract class DeepProxy<T extends object = any> {
  private readonly _paths: WeakMap<object, PropertyKey[]> = new WeakMap();
  protected _root: T;
  private readonly _handler: ProxyHandler<any>;
  public declare proxy: T;

  constructor(root: T = {} as T) {
    if (typeof root !== "object") {
      throw TypeError("Root value has to be of type object");
    }
    this._root = root;

    const handler: ProxyHandler<any> = {};
    for (const hook of hookKeys) {
      handler[hook] = (t: any, ...args: any[]) => {
        const path = this._paths.get(t);
        if (!path) throw Error("Path not found");
        //console.log(hook, ["root", ...path].join("."));
        return this[hook](
          path,
          //@ts-ignore
          ...args
        );
      };
    }
    this._handler = handler;

    this.proxy = this.addPath([], Object.getPrototypeOf(this._root));
  }

  protected addPath(path: PropertyKey[], proto: object | null) {
    const t = Array.isArray(proto) ? [] : Object.create(proto);
    this._paths.set(t, path);
    return new Proxy(t, this._handler);
  }

  getByPath(path: PropertyKey[]) {
    return path.reduce((o, k) => o[k], this._root as any);
  }

  getOwnPropertyDescriptor(
    path: PropertyKey[],
    prop: string | number | symbol
  ): PropertyDescriptor | undefined {
    const target = this.getByPath(path);
    const descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
    if (!descriptor) return undefined;
    return Object.assign(descriptor, { configurable: true });
  }

  get(path: PropertyKey[], prop: PropertyKey): any {
    const target = this.getByPath(path);
    const val: unknown = Reflect.get(target, prop);
    if (typeof val === "object" && val) {
      return this.addPath([...path, prop], Object.getPrototypeOf(val));
    }
    return val;
  }
}
interface DeepProxy extends Required<HookMap> {}
for (const key of Object.getOwnPropertyNames(Reflect) as HookKey[]) {
  if (DeepProxy.prototype[key]) continue;
  DeepProxy.prototype[key] = function(
    this: DeepProxy,
    path: PropertyKey[],
    ...args: any[]
  ) {
    const target = this.getByPath(path);
    return Reflect[key](
      target,
      //@ts-ignore
      ...args
    );
  };
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
