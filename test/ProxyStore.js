const { FileHandler, ProxyStore } = require("../dist");
const fs = require("fs");
const expect = require("chai").expect;

const handler = new FileHandler("test.json");

describe("ProxyStore", function() {
  describe("constructor", function() {
    it("should require an argument", function() {
      expect(() => new ProxyStore()).to.throw();
    });
  });

  describe("properties", function() {
    it("should have a property 'proxy' of type object", function() {
      const p = new ProxyStore(handler, { init: false });
      expect(p.proxy).to.be.an("object");
    });

    it("shoudn't expose a store property", function() {
      const p = new ProxyStore(handler, { init: false });
      expect(p.store).to.be.a("undefined");
    });
  });

  describe("loading", function() {
    it("should load the saved store when load() is called", function() {
      const store = { a: 1, b: "c", d: [1, 2] };
      const p = new ProxyStore(handler, { init: false });
      fs.writeFileSync("test.json", JSON.stringify(store));
      p.load();
      expect(p.proxy).to.deep.equal(store);
    });

    it("should load on init if init=true", function() {
      const store = { a: 1, b: "c", d: [1, 2] };
      fs.writeFileSync("test.json", JSON.stringify(store));
      const proxy = new ProxyStore(handler, { init: true }).proxy;
      expect(proxy).to.deep.equal(store);
    });
  });
});
