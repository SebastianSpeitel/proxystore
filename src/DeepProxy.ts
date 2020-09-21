type HookKey = keyof typeof Reflect;
const hookKeys = Object.getOwnPropertyNames(Reflect) as HookKey[];

type Hook<H extends keyof typeof Reflect> = (
  path: PropertyKey[],
  ...args: Parameters<typeof Reflect[H]> extends [any, ...infer A] ? A : []
) => ReturnType<typeof Reflect[H]>;

type Hooks = {
  [H in HookKey]: Hook<H>;
};

class DeepProxy<T extends object = any> {
  private readonly _paths: WeakMap<object, PropertyKey[]> = new WeakMap();
  private readonly _proxies = new WeakMap<object, object>();
  protected _root: T;
  private readonly _handler: ProxyHandler<any>;
  public readonly proxy: T;

  constructor(root: T = {} as T) {
    if (typeof root !== "object") {
      throw TypeError("Root value has to be of type object");
    }
    this._root = root;

    const handler: ProxyHandler<object> = {};
    for (const hook of hookKeys) {
      handler[hook] = (t: object, ...args: any[]) => {
        const path = this._paths.get(t);
        if (!path) throw Error("Path not found");

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

  protected addPath(path: PropertyKey[], original: object) {
    // Check if deep object has been accessed before
    const cached = this._proxies.get(original);
    if (cached) {
      return cached;
    }

    // Create empty object with same prototype
    let target: any;
    if (Array.isArray(original)) {
      target = [];
    } else {
      target = Object.create(Object.getPrototypeOf(original));
    }

    // Create proxy and cache it
    const proxy = new Proxy(target, this._handler);
    this._proxies.set(original, proxy);
    this._paths.set(target, path);

    return proxy;
  }

  getByPath(path: PropertyKey[]) {
    try {
      const obj = path.reduce((o: any, k) => o[k], this._root);
      if (!obj) throw Error();
      return obj;
    } catch (e) {
      /* istanbul ignore next */
      throw ReferenceError(
        `Trying to access property ${path.join(
          "."
        )} failed. Probably because it was removed.`
      );
    }
  }

  /** Always configurable to comply with:
   * > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   * > https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor (Invariants)
   * */
  getOwnPropertyDescriptor(
    path: PropertyKey[],
    prop: PropertyKey
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
      return this.addPath([...path, prop], val);
    }
    return val;
  }
}
/** Extends the defined DeepProxy by adding all other possible hooks */
interface DeepProxy extends Hooks {}
for (const key of Object.getOwnPropertyNames(Reflect) as HookKey[]) {
  // Ignore already defined hooks
  if (DeepProxy.prototype[key]) continue;

  // Create hook for all other traps
  DeepProxy.prototype[key] = function(
    this: DeepProxy,
    path: PropertyKey[],
    ...args: any[]
  ) {
    const target = this.getByPath(path);
    return Reflect[key](
      target,
      //@ts-ignore typescript miscalculates the length of args
      ...args
    );
  };
}

export default DeepProxy;
