import proxy, { ProxyStore } from "../src";
class DerivedProxyStore extends ProxyStore {}
import { expect } from "chai";

describe("proxy function", function() {
  it("should require at least one parameter", function() {
    //@ts-ignore
    expect(() => proxy()).to.throw();
  });

  it("should accept just a proxystore", function() {
    expect(() => proxy(ProxyStore)).to.not.throw();
  });

  it("should accept just a derived proxystore", function() {
    expect(() => proxy(DerivedProxyStore)).to.not.throw();
  });

  it("should accept a root parameter with a proxystore", function() {
    expect(() => proxy({}, ProxyStore)).to.not.throw();
  });

  it("should accept an options object after the proxystore", function() {
    expect(() => proxy(ProxyStore, {})).to.not.throw();
  });

  it("should accept an options object after the proxystore and root parameter", function() {
    expect(() => proxy({}, ProxyStore, {})).to.not.throw();
  });
});
