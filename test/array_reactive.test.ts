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

test("computed setting array after", () => {
  const x = new nn({
    data: { ab: "not an array", c: "d" },
    computed: {
      abc: {
        fn: function() {
          if (Array.isArray(this.state.ab))
            return this.state.ab.join("") + this.state.c;
          else return this.state.ab + this.state.c;
        },
        dependencies: ["ab", "c"],
      },
    },
  });
  expect(x.state.abc).toBe("not an arrayd");
  x.state.ab = ["a", "b", "c"];
  expect(x.state.abc).toBe("abcd");
});

test("set array from different nn", () => {
  const x = new nn({
    data: { exArray: [1, 2] },
  });
  const y = new nn({
    data: { exArray: [3, 4] },
  });
  x.state.exArray = y.state.exArray;
});
