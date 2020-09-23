import nn from "../src/construct";
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

test("setting new obj, scratch, spread", () => {
  const x = new nn({
    data: {
      obj: { x: "one" },
      obj2: { x: "two" },
    },
    computed: {
      oneTwo: {
        fn() {
          return this.state.obj.x + this.state.obj2.x;
        },
        dependencies: ["obj", "obj2"],
      },
    },
  });

  expect(x.state.oneTwo).toBe("onetwo");
  x.state.obj2 = { x: "three" };
  expect(x.state.oneTwo).toBe("onethree");
  x.state.obj = { ...x.state.obj, x: "two" };
  expect(x.state.oneTwo).toBe("twothree");
});
