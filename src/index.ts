import ProxyStore, { ProxyStoreOptions } from "./ProxyStore";
import IOHandler from "./io/IOHandler";

export { ProxyStore, ProxyStoreOptions };

export { default as FileHandler } from "./io/FileHandler";
export { default as DeepProxy } from "./DeepProxy";

export function proxyStore<T extends object>(
  handler: string | IOHandler<T>,
  opts?: ProxyStoreOptions<T>
) {
  return new ProxyStore(handler, opts).store;
}
export { proxyStore as default };
