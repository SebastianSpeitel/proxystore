![Tests](https://github.com/SebastianSpeitel/proxystore/workflows/Tests/badge.svg?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=@sebastianspeitel/proxystore)](https://packagephobia.now.sh/result?p=@sebastianspeitel/proxystore)

# proxystore

Persistent object storage using proxies

## Usage

### Short way

```javascript
import proxy, { ProxyStoreJSON as ProxyStore } from "../src";

const store = proxy(ProxyStore, { path: "store.json" });
store.foo = "bar";
```

Now you can use `store` like any other object and it will be saved in `store.json`.

### Long way

```javascript
import { ProxyStoreJSON as ProxyStore } from "../src";

const store = new ProxyStore({ foo: "baz" }, { path: "store.json" }).store;
store.foo = "bar";
```

## TypeScript

All methods take a type to use for the store, so you can provide it for autocompletion.

### Example

```typescript
interface FooBar {
  foo: number;
  bar: string;
}

const store = proxy<FooBar>(ProxyStore, { path: "store.json" });

store.foo; // works
store.baz; // Property 'baz' does not exist on type 'FooBar'
```

## Extensions

You can implement your own ways of serializing the store. Just extends the class `ProxyStore` overwrite the methods you want and call `proxy` with your own class as parameter.

### Example

```javascript
class MyProxyStore extends ProxyStore {
  get(path: PropertyKey[], prop: PropertyKey): any {
    console.log(`Property ${[...path, prop].join(".")} requested`);
    return super.get(path, prop);
  }
}

const store = proxy({ foo: "bar" }, MyProxyStore);
store.foo; // Property foo requested
```
