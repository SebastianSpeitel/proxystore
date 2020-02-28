import proxy, { ProxyStore } from "../src";

class MyProxyStore extends ProxyStore {
  get(path: PropertyKey[], prop: PropertyKey): any {
    console.log(`Property ${[...path, prop].join(".")} requested`);
    return super.get(path, prop);
  }
}

const store = proxy({ foo: "bar" }, MyProxyStore);
store.foo; // Property foo requested
