import IOHandler from "./IOHandler";
import * as fs from "fs";
import { ProxyStore } from "../index";

interface FileHandlerOptions {
  watch?: boolean;
}

export default class FileHandler<T extends object> implements IOHandler<T> {
  private declare path: string;
  private declare store?: ProxyStore<T>;
  private declare options: FileHandlerOptions;
  private watchPaused = false;
  public declare watcher?: fs.FSWatcher;

  constructor(path: string, opt: FileHandlerOptions = {}) {
    if (!path) throw TypeError("Path argument required");
    this.options = opt;
    this.path = path;
  }

  load() {
    try {
      const json = fs.readFileSync(this.path).toString();
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  save(store: object) {
    this.watchPaused = true;
    fs.writeFileSync(this.path, JSON.stringify(store));
    this.watchPaused = false;
  }

  handle(proxyStore: ProxyStore<T>) {
    this.store = proxyStore;
    this.store.save();
    if (this.options.watch) {
      this.watcher = fs.watch(this.path, () => this.changed());
    }
  }

  changed() {
    if (this.watchPaused) return;
    this?.store?.load();
  }
}
