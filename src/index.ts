import ProxyStore from "./proxystore/base";

export { ProxyStore };

export { default as DeepProxy } from "./DeepProxy";
export { default as ProxyStoreFS } from "./proxystore/fs";

type GenericOptions = {
  [key: string]: any;
};

type ProxyStoreConstructor<
  T extends object,
  P extends ProxyStore<T>,
  O extends GenericOptions
> = { new (root: T, options?: O): P };

function isProxyStoreConstructor(
  obj: any
): obj is ProxyStoreConstructor<any, any, any> {
  return (
    ProxyStore === obj || Object.prototype.isPrototypeOf.call(ProxyStore, obj)
  );
}

export function proxy<
  T extends object = any,
  P extends ProxyStore<T> = ProxyStore<T>,
  O extends GenericOptions = {}
>(proxyStoreConstructor: ProxyStoreConstructor<T, P, O>, options?: O): T;

export function proxy<
  T extends object = any,
  P extends ProxyStore<T> = ProxyStore<T>,
  O extends GenericOptions = {}
>(
  root: T,
  proxyStoreConstructor: ProxyStoreConstructor<T, P, O>,
  options?: O
): T;

export function proxy<
  T extends object = any,
  P extends ProxyStore<T> = ProxyStore<T>,
  O extends GenericOptions = {}
>(
  param1: T | ProxyStoreConstructor<T, P, O>,
  param2?: ProxyStoreConstructor<T, P, O> | O,
  param3?: O
): T {
  // First argument is a ProxyStore
  if (isProxyStoreConstructor(param1)) {
    const PS = param1 as ProxyStoreConstructor<T, P, O>;
    return new PS({} as T, param2 as O).store;
  }

  // Second argument is a ProxyStore
  if (isProxyStoreConstructor(param2)) {
    const PS = param2 as ProxyStoreConstructor<T, P, O>;
    return new PS(param1 as T, param3 as O).store;
  }

  // No ProxyStore provided
  throw TypeError("No ProxyStore or derivative of it provided");
}
export { proxy as default };
