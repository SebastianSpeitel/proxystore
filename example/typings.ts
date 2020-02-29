import proxy, { ProxyStoreJSON as ProxyStore } from "../src";

interface FooBar {
  foo: number;
  bar: string;
}

const store = proxy<FooBar>(ProxyStore, { path: "store.json" });

store.foo; // works
store.baz; // Property 'baz' does not exist on type 'FooBar'
