import type { ProxyStore } from "../index";

export default interface IOHandler<T extends object> {
  load: () => T;
  save: (store: T) => void | Promise<void>;
  handle?: (proxyStore: ProxyStore<T>) => void;
}
