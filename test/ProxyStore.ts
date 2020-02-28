import { FileHandler, ProxyStore, proxyStore } from "../src";
import * as fs from "fs";
import { expect } from "chai";

const handler = new FileHandler("test.json");

describe("ProxyStore", function() {
  describe("constructor", function() {
    it("should require an argument", function() {
      //@ts-ignore
      expect(() => new ProxyStore()).to.throw();
    });

    it("should throw for invalid init options", function() {
      //@ts-ignore
      expect(() => new ProxyStore(handler, { init: 1 })).to.throw();
    });
  });

  describe("properties", function() {
    it("should have a property 'proxy' of type object", function() {
      const p = new ProxyStore(handler, { init: false });
      expect(p.store).to.be.an("object");
    });
  });

  describe("loading", function() {
    it("should load the saved store when load() is called", function() {
      const store = { a: 1, b: "c", d: [1, 2, 5] };
      const p = new ProxyStore(handler, { init: false });
      fs.writeFileSync("test.json", JSON.stringify(store));
      p.load();
      expect(p.store).to.deep.equal(store);
    });

    it("should load on init if init=true", function() {
      const store = { a: 1, b: "c", d: [1, 2, 4] };
      fs.writeFileSync("test.json", JSON.stringify(store));
      const p = new ProxyStore(handler, { init: true });
      expect(p.store).to.deep.equal(store);
    });

    it("should use init as the inital store value when given", function() {
      const store = { a: 1, b: "c", d: [1, 2, 3] };
      const p = new ProxyStore(handler, { init: store });
      expect(p.store).to.deep.equal(store);
    });
  });

  describe("saving", function() {
    it("should save when properties are modified", function() {
      const proxy = new ProxyStore<any>(handler, { init: {} }).store;
      proxy.foo = "bar";
      const json = fs.readFileSync("test.json").toString();
      const store = JSON.parse(json);
      expect(store).to.deep.equal({ foo: "bar" });
    });

    it("should reflect delting properties", function() {
      const proxy = new ProxyStore<any>(handler, { init: { bar: "foo" } })
        .store;
      delete proxy.bar;
      const json = fs.readFileSync("test.json").toString();
      const store = JSON.parse(json);
      expect(store).to.deep.equal({});
    });

    it("should allow replacing the store", function() {
      const proxyStore = new ProxyStore<any>(handler, { init: { bar: "foo" } });
      const obj = { foo: "bar" };
      proxyStore.store = obj;
      const json = fs.readFileSync("test.json").toString();
      const store = JSON.parse(json);
      expect(store).to.deep.equal(obj);
    });
  });

  describe("proxyStore function", function() {
    it("should require an argument", function() {
      //@ts-ignore
      expect(() => proxyStore()).to.throw();
    });

    it("should return an object", function() {
      const proxy = proxyStore(handler);
      expect(proxy).to.be.an("object");
    });
  });
});
