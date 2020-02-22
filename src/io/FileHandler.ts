import IOHandler from "./IOHandler";
import * as fs from "fs";

export default class FileHandler<T extends object> implements IOHandler<T> {
  declare path: string;
  constructor(path: string) {
    this.path = path;
  }

  load() {
    try {
      const json = fs.readFileSync(this.path).toString();
      return JSON.parse(json);
    } catch (e) {
      return {}
    }
  }

  save(store: object) {
    fs.writeFileSync(this.path, JSON.stringify(store));
  }
}
