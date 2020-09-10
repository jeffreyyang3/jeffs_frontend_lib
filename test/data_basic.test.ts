// import { noName } from "../src/typescript/fw/construct";

import { reactiveData } from "../src/typescript/fw/data";

import { nn } from "../src/typescript/fw/construct";
import { constructArgs } from "../src/typescript/typedefs";

test("basic object set", () => {
  const x = new reactiveData({ initialData: "asdf" });
  expect(x.getData()).toBe("asdf");
  x.setData("dank");
  expect(x.getData()).toBe("dank");
});

test("set side effects callback", () => {
  const x: constructArgs["data"] = {};
  let flag = false;
  const y = new reactiveData({
    initialData: "asdf",
    dataChangedCallback: newVal => {
      flag = newVal;
    }
  });
  Object.defineProperty(x, "x", {
    enumerable: true,
    get: () => y.getData(),
    set: val => y.setData(val)
  });
  x["x"] = "asdff";
  expect(flag).toBe("asdff");
  expect(x.x).toBe(flag);
});

test("nn data set", () => {
  const x = new nn({
    data: {
      x: "x",
      y: "y"
    }
  });
  expect(x.state.x).toBe("x");
  expect(x.state.y).toBe("y");
});

test("basic nn object set", () => {
  const x = new nn({ data: { x: "y", z: "asdf" } });
  expect(x.state.x).toBe("y");
  x.state.x = "z";
  expect(x.state.x).toBe("z");
  expect("hello").toBe("hello");
});

test("basic computed", () => {
  const x = new nn({
    data: { n1: 1, n2: 1 },
    computed: {
      n1n2: {
        fn: function() {
          return this.state.n1 + this.state.n2;
        },
        dependencies: ["n1", "n2"]
      }
    }
  });

  expect(x.state.n1n2).toBe(2);
  x.state.n1 = 4;
  expect(x.state.n1n2).toBe(5);
});

// test("basic computed, no dependency on computed", () => {
//   const nn = new nn({
//     data: { n1: 1, n2: 1 },
//     computed: {
//       "onePlusTwo": {
//         fn: function() {
//           return this.state.n1 + this.state.n2;
//         },
//         dependencies: ['n1', 'n2']
//       }
//     }
//   });
//   expect(nn.state.onePlusTwo).toBe(2);
//   nn.state.n2 = 2;
//   expect(nn.state.onePlusTwo).toBe(3);

//});
