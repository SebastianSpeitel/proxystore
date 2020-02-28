import { DeepProxy } from "../src";
import { expect } from "chai";

describe("DeepProxy", function() {
  describe("constructor", function() {
    it("should throw for an invalid root value", function() {
      //@ts-ignore
      expect(() => new DeepProxy(1)).to.throw();
      //@ts-ignore
      expect(() => new DeepProxy(false)).to.throw();
      //@ts-ignore
      expect(() => new DeepProxy("")).to.throw();
    });

    it("should accept an object", function() {
      expect(() => new DeepProxy({})).not.to.throw();
    });

    it("should accept an array", function() {
      expect(() => new DeepProxy([])).not.to.throw();
    });

    it("should accept no arguments", function() {
      expect(() => new DeepProxy()).not.to.throw();
    });

    it("should use an object as root value", function() {
      const obj = { a: 1 };
      expect(new DeepProxy(obj).proxy).to.deep.equal(obj);
    });

    it("should use an array as root value", function() {
      const arr = [1, 2, 3];
      expect(new DeepProxy(arr).proxy).to.deep.equal(arr);
    });

    it("should initialize with an empty object for no given arguments", function() {
      expect(new DeepProxy().proxy).to.deep.equal({});
    });
  });

  it("should allow non-object properties", function() {
    const p = new DeepProxy().proxy;
    p.a = 5;
    p.b = "foo";
    p.c = false;
    expect(p.a).to.equal(5);
    expect(p.b).to.equal("foo");
    expect(p.c).to.equal(false);
  });

  it("should allow object properties", function() {
    const p = new DeepProxy().proxy;
    const obj = { a: 1 };
    p.a = obj;
    expect(p.a).to.deep.equal(obj);
  });

  it("should allow array properties", function() {
    const p = new DeepProxy().proxy;
    const arr = [1, 2];
    p.a = arr;
    expect(p.a).to.deep.equal(arr);
  });

  it("should allow nested properties", function() {
    const p = new DeepProxy().proxy;
    const obj = { a: [{ b: 1 }] };
    p.a = obj;
    expect(p.a).to.deep.equal(obj);
  });

  it("should allow deleting properties", function() {
    const root = { a: 1 };
    const p = new DeepProxy(root).proxy;
    delete p.a;
    expect(p).to.not.have.key("a");
  });

  it("should allow deleting nested properties", function() {
    const root = { a: { b: 1 } };
    const p = new DeepProxy(root).proxy;
    delete p.a.b;
    expect(p.a).to.not.have.key("b");
  });
});
