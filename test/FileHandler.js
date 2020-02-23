const { FileHandler } = require("../dist");
const expect = require("chai").expect;

describe("FileHandler", function() {
  describe("constructor", function() {
    it("should require an argument", function() {
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
  });
});
