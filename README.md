![Tests](https://github.com/SebastianSpeitel/proxystore/workflows/Tests/badge.svg?branch=master)

# proxystore

Persistent object storage using proxies

## Usage

```javascript
import { ProxyStore, FileHandler } from "@sebastianspeitel/proxystore";

const handler = new FileHandler("store.json");
const store = new ProxyStore(handler).store;
```

Now you can use `store` as any other object and it will be saved in `store.json`

## Options

```typescript
export interface ProxyStoreOptions<T extends object> {
  // true to load the initial store using the provided handler
  // or provide an object to use as initial value
  init?: T | boolean;
}
```

## TypeScript

All methods take a type to use for the store, so you can provide it for autocompletion.

### Example

```typescript
interface FooBar {
  foo: number;
  bar: string;
}

const store = new ProxyStore<FooBar>(handler).store;

store.foo; // works
store.baz; // doesn't work
```

## Handler

You can provide your own handler. Any object with a `load` and `save` method works. An optional method `handle` gets invoked with the proxystore as a parameter.
