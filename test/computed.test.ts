import { nn } from "../src/typescript/fw/construct";
test("basic computed, depend only on data", () => {
  const x = new nn({
    data: { n1: 1, n2: 1 },
    computed: {
      n1n2: {
        fn: function() {
          return this.state.n1 + this.state.n2;
        },
        dependencies: ["n1", "n2"],
      },
      n1n2plusn1: {
        fn: function() {
          return this.state.n1n2 + this.state.n1;
        },
        dependencies: ["n1", "n1n2"],
      },
    },
  });
  expect(x.state.n1n2).toBe(2);
  x.state.n1 = 4;
  expect(x.state.n1n2).toBe(5);
  x.state.n2 = 6;
  expect(x.state.n1n2).toBe(10);
  x.state.n1 = x.state.n1n2;
  expect(x.state.n1n2).toBe(16);
});
test("computed depending on other computed", () => {
  const x = new nn({
    data: { n1: 1, n2: 1 },
    computed: {
      n1n2: {
        fn: function() {
          return this.state.n1 + this.state.n2;
        },
        dependencies: ["n1", "n2"],
      },
      n1n2plusn1: {
        fn: function() {
          return this.state.n1n2 + this.state.n1;
        },
        dependencies: ["n1", "n1n2"],
      },
    },
  });
  expect(x.state.n1n2plusn1).toBe(3);
  x.state.n2 = 100;
  // n1 = 1, n2 = 100, n1n2 101 expect 101 + 1 102;
  expect(x.state.n1n2plusn1).toBe(102);
});

test("invalid computed should throw error on init", () => {
  expect(
    () =>
      new nn({
        data: { n1: 1, n2: 1 },
        computed: {
          n1n2: {
            fn: function() {
              return this.state.n1 + this.state.n2 + this.state.n1n2plusn1;
            },
            dependencies: ["n1", "n2", "n1n2plusn1"],
          },
          n1n2plusn1: {
            fn: function() {
              return this.state.n1n2 + this.state.n1;
            },
            dependencies: ["n1", "n1n2"],
          },
        },
      })
  ).toThrow("unable to resolve computed dependencies");
});
