import { nn } from "../src/typescript/fw/construct";
test("computed depending on array: push", () => {
  const x = new nn({
    data: { ab: ["a", "b"], c: "d" },
    computed: {
      abc: {
        fn: function() {
          return this.state.ab.join("") + this.state.c;
        },
        dependencies: ["ab", "c"],
      },
    },
  });
  expect(x.state.abc).toBe("abd");
  x.state.ab.push("c");
  expect(x.state.abc[2]).toBe("c");
  expect(x.state.abc).toBe("abcd");
});

test("computed depending on array: pop", () => {
  const x = new nn({
    data: { ab: ["a", "b"], c: "d" },
    computed: {
      abc: {
        fn: function() {
          return this.state.ab.join("") + this.state.c;
        },
        dependencies: ["ab", "c"],
      },
    },
  });
  expect(x.state.abc).toBe("abd");
  x.state.ab.pop();
  expect(x.state.ab.length).toBe(1);
  expect(x.state.abc).toBe("ad");
});
