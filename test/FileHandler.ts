import { FileHandler } from "../src";
import { expect } from "chai";
import * as fs from "fs";

describe("FileHandler", function() {
  describe("constructor", function() {
    it("should require an argument", function() {
      //@ts-ignore
      expect(() => new FileHandler()).to.throw();
    });
  });

  describe("save", function() {
    it("should be a function", function() {
      const h = new FileHandler("test.json");
      expect(h.save).to.be.a("function");
    });
  });

  describe("load", function() {
    it("should be a function", function() {
      const h = new FileHandler("test.json");
      expect(h.load).to.be.a("function");
    });

    it("should return an empty object if file doesn't exist", function() {
      try {
        fs.unlinkSync("test.json");
      } catch (e) {}
      const h = new FileHandler("test.json");
      expect(h.load()).to.deep.equal({});
    });
  });

  describe("watching", function() {
    it("should call load when the file changes", function(done) {
      const h = new FileHandler("watchtest.json", { watch: true });
      function save() {
        fs.writeFileSync("watchtest.json", "{}");
      }
      save();
      const proxyStoreDummy: any = {
        save: () => {},
        load: () => {
          done();
          h?.watcher?.close();
        }
      };
      h.handle(proxyStoreDummy);
      save();
    });
  });
});
