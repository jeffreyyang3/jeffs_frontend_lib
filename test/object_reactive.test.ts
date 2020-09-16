import { nn } from "../src/typescript/fw/construct";
test("top level object set reacts", () => {
  const x = new nn({
    data: {
      obj: { x: "asdf" },
    },
    computed: {
      xProp: {
        fn() {
          return this.state.obj.x;
        },
        dependencies: ["obj"],
      },
    },
  });
  expect(x.state.xProp).toBe("asdf");
  x.state.obj.x = "new";
  expect(x.state.xProp).toBe("new");
});

test("object deeper manual set reacts", () => {
  const x = new nn({
    data: {
      obj: { x: { x: 1 } },
    },
    computed: {
      xProp: {
        fn() {
          return this.state.obj.x.x;
        },
        dependencies: ["obj"],
      },
    },
  });
  expect(x.state.xProp).toBe(1);
  x.state.obj.x.x = 2;
  // does not recompute automatically
  expect(x.state.xProp).toBe(1);
  x.setState(["obj", "x", "x"], "new");
  expect(x.state.xProp).toBe("new");
});
