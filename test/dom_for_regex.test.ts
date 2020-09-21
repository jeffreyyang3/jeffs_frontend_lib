import {
  inRegex,
  getStateData,
  getBaseStateReference,
} from "../src/typescript/fw/dom/template_for";
test("in regex captures correct groups, basic", () => {
  const [_, iterName, inName] = inRegex.exec("asdf in fasd");
  expect(iterName).toBe("asdf");
  expect(inName).toBe("fasd");
});
test("in regex captures correct groups, dots", () => {
  const inName = "fasd.fdfdfd.asdfa.qwewew.d";
  const [_, iterName, parsedInName] = inRegex.exec(`asdf in ${inName}`);
  expect(iterName).toBe("asdf");
  expect(parsedInName).toBe(inName);
});

test("get state base regex captures correct group", () => {
  const baseExpr = "asdf in dank";
  expect(getBaseStateReference(baseExpr)).toBe("dank");
  const dotExpr = "i in dank.asdf.fdfdd";
  expect(getBaseStateReference(dotExpr)).toBe("dank");
});

test("accesses correct data properties", () => {
  const state = {
    x: {
      y: {
        z: 12,
      },
    },
  };
  expect(getStateData(state, "x")).toBe(state.x);
  expect(getStateData(state, "x.y")).toBe(state.x.y);
  expect(getStateData(state, "x.y.z")).toBe(state.x.y.z);
});
