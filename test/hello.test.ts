import {noName} from "../src/typescript/fw/construct";

test("hello", () => {
  const x = new noName({ data: {x: 'y'}});
  expect(x.state.x).toBe('y');
  expect("hello").toBe("hello");
});
