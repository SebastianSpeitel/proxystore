import { ProxyStoreFS as ProxyStore } from "../../src";
import { expect } from "chai";
import * as fs from "fs";

describe("ProxyStore fs", function() {
  describe("constructor", function() {
    it("should require an argument", function() {
      //@ts-ignore
      expect(() => new ProxyStore()).to.throw();
    });

    it("should load the saved store when load() is called", function() {
      const store = { a: 1, b: "c", d: [1, 2, 5] };
      const p = new ProxyStore({}, { path: "test.json" });
      fs.writeFileSync("test.json", JSON.stringify(store));
      p.load();
      expect(p.store).to.deep.equal(store);
    });

    it("should load on init if init=true", function() {
      const store = { a: 1, b: "c", d: [1, 2, 4] };
      fs.writeFileSync("test.json", JSON.stringify(store));
      const p = new ProxyStore({}, { init: true, path: "test.json" });
      expect(p.store).to.deep.equal(store);
    });

    it("should use the given root parameter as root value", function() {
      const store = { a: 1, b: "c", d: [1, 2, 3] };
      const p = new ProxyStore(store, { path: "test.json" });
      expect(p.store).to.deep.equal(store);
    });
  });

  describe("save", function() {
    it("should be a function", function() {
      const p = new ProxyStore({}, { path: "test.json" });
      expect(p.save).to.be.a("function");
    });
  });

  describe("saving", function() {
    it("should save when properties are modified", function() {
      const proxy = new ProxyStore<any>(
        {},
        {
          path: "test.json"
        }
      ).store;
      proxy.foo = "bar";
      const json = fs.readFileSync("test.json").toString();
      const store = JSON.parse(json);
      expect(store).to.deep.equal({ foo: "bar" });
    });

    it("should reflect delting properties", function() {
      const proxy = new ProxyStore<any>(
        { bar: "foo" },
        {
          path: "test.json"
        }
      ).store;
      delete proxy.bar;
      const json = fs.readFileSync("test.json").toString();
      const store = JSON.parse(json);
      expect(store).to.deep.equal({});
    });

    it("should allow replacing the store", function() {
      const proxyStore = new ProxyStore<any>(
        { bar: "foo" },
        {
          path: "test.json"
        }
      );
      const obj = { foo: "bar" };
      proxyStore.store = obj;
      const json = fs.readFileSync("test.json").toString();
      const store = JSON.parse(json);
      expect(store).to.deep.equal(obj);
    });

    it("should prettify when told so", function() {
      const obj = { a: 1 };
      const p = new ProxyStore<any>(obj, {
        path: "test.json"
      });
      p.pretty = 2;
      p.save();
      let json = fs.readFileSync("test.json").toString();
      expect(json).to.equal(JSON.stringify(obj, null, 2));

      p.pretty = true;
      p.save();
      json = fs.readFileSync("test.json").toString();
      expect(json).to.equal(JSON.stringify(obj, null, 2));
    });
  });

  describe("load", function() {
    it("should be a function", function() {
      const p = new ProxyStore({}, { path: "test.json" });
      expect(p.load).to.be.a("function");
    });

    it("should return an empty object if file doesn't exist", function() {
      try {
        fs.unlinkSync("test.json");
      } catch (e) {}
      const p = new ProxyStore({}, { path: "test.json" });
      p.load();
      expect(p.store).to.deep.equal({});
    });
  });

  describe("watching", function() {
    it("should load when the file changes", function(done) {
      const obj = { a: 1 };
      fs.writeFileSync("watchtest.json", JSON.stringify({}));
      const p = new ProxyStore(
        {},
        {
          watch: true,
          path: "watchtest.json"
        }
      );
      fs.writeFileSync("watchtest.json", JSON.stringify(obj));
      p.watcher?.on("change", () => {
        p.watcher?.close();
        setImmediate(() => {
          expect(p.store).to.deep.equal(obj);
          done();
        });
      });
    });
  });
});
