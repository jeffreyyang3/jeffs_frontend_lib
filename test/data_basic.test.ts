import { noName } from "../src/typescript/fw/construct";

test("basic object set", () => {
  const x = new noName({ data: { x: "y", z: "asdf" } });
  expect(x.state.x).toBe("y");
  x.state.x = "z";
  expect(x.state.x).toBe("z");
  expect("hello").toBe("hello");
});

test("basic computed, no dependency on computed", () => {
  const x = new noName({
    data: { x: "y", z: "asdf" },
    computed: {
      "xz": {
        fn: function() {
          return this.state.x + this.state.z;
        },
        dependencies: ['x', 'y']
      }
    }
  });
  expect(x.state.xz).toBe('yasdf');
  x.state.x = 'asdf';
  expect(x.state.xz).toBe('asdfasdf');
});
