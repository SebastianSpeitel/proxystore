import { ProxyStoreFS as ProxyStore } from "../dist";

const store = new ProxyStore({ foo: "baz" }, { path: "store.json" }).store;
store.foo = "bar";
