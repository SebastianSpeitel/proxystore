// let s = new proxystore.ProxyStore({ load: () => ({}), save: console.log })
//   .store;

// s.o = { a: 1 };
// let o = s.o;
// s.o = 1;
// console.log(o.a);

function a() {
  console.log(1);
  try {
    console.log(2);
    return;
  } catch (e) {
  } finally {
    console.log(3);
  }
}

a();