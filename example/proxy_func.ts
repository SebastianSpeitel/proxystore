import proxy, { ProxyStoreJSON as ProxyStore } from "../src";

const store = proxy(ProxyStore, { path: "store.json" });
store.foo = "bar";
