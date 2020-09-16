import { reactiveData } from "../src/typescript/fw/data";
import { nn } from "../src/typescript/fw/construct";
import { constructArgs } from "../src/typescript/typedefs";

test("nn data set", () => {
  const x = new nn({
    data: {
      x: "x",
      y: "y",
    },
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
