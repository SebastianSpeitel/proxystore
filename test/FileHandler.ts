import { FileHandler } from '../src'
import { expect } from 'chai'

describe("FileHandler", function () {
  describe("constructor", function () {
    it("should require an argument", function () {
      //@ts-ignore
      expect(() => new FileHandler()).to.throw();
    });
  });

  describe("save", function () {
    it("should be a function", function () {
      const h = new FileHandler("test.json");
      expect(h.save).to.be.a("function");
    });
  });

  describe("load", function () {
    it("should be a function", function () {
      const h = new FileHandler("test.json");
      expect(h.load).to.be.a("function");
    });
  });
});
