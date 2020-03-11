import ProxyStoreBase from "./base";
import fetch, { RequestInit } from "node-fetch";
import { HookKey } from "../DeepProxy";

enum HTTPMethod {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  CONNECT = "CONNECT",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PATCH = "PATCH"
}

type Methods = {
  [hook in HookKey]?: HTTPMethod;
};

type Format = "json" | "text";

interface Options {
  baseUrl: string;
  methods?: Methods;
  format?: Format | { request: Format; response: Format };
  header?: Record<string, string>;
}

const defaultMethods: Methods = {
  apply: HTTPMethod.POST,
  get: HTTPMethod.GET,
  set: HTTPMethod.PUT
};

export default class ProxyStore<T extends object = any> extends ProxyStoreBase<
  T
> {
  private declare baseUrl: string;
  private declare methods: Methods;
  private declare format: { request: Format; response: Format };
  private declare header: Record<string, string>;

  constructor(
    root: T = {} as T,
    { baseUrl, methods, format, header }: Options = {
      baseUrl: "localhost"
    }
  ) {
    if (typeof baseUrl !== "string" || !baseUrl) {
      throw TypeError(`Invalid option baseUrl="${baseUrl}"`);
    }
    super(root);

    this.methods = methods ? { ...defaultMethods, ...methods } : defaultMethods;
    if (format) {
      if (typeof format === "object") {
        this.format = format;
      } else {
        this.format = {
          request: format,
          response: format
        };
      }
    } else {
      this.format = { request: "json", response: "json" };
    }
    this.header = header || {};
  }

  async HTTPRequest(
    path: PropertyKey[],
    { hook, params }: { hook: HookKey; params?: any }
  ) {
    let url = this.baseUrl;
    url += "/";
    url += path.map(p => encodeURIComponent(p.toString())).join("/");

    const initData: RequestInit = { headers: { ...this.header } };
    if (hook && hook in this.methods) {
      initData.method = this.methods[hook];
    }

    switch (this.format.request) {
      case "json":
        initData.headers = {
          ...initData.headers,
          "Content-Type": "application/json"
        };
        initData.body = JSON.stringify(params);
        break;
    }

    const resp = await fetch(url, initData);

    switch (this.format.response) {
      case "json":
        return resp.json();
      default:
        return resp.text();
    }
  }

  //@ts-ignore
  set(path: PropertyKey[], prop: PropertyKey, val: any) {
    this.HTTPRequest([...path, prop], { hook: "set", params: val });
    return true;
  }

  get(path: PropertyKey[], prop: PropertyKey) {
    return this.HTTPRequest([...path, prop], { hook: "get" });
  }
}
