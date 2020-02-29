import { ProxyStoreJSON as ProxyStore } from "../src";

const store = new ProxyStore({ foo: "baz" }, { path: "store.json" }).store;
store.foo = "bar";
