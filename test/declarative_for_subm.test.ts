import {
  resolveFor,
  getNNForsOneLvl,
} from "../src/typescript/fw/dom/template_for";
beforeEach(() => {
  document.body.innerHTML = `<!DOCTYPE html>
        <body>
        <div nn-for="i in arr" class="asdf">
            <span class="asdfchildspan"></span>
            <span class="asdfchildspan"></span>
            <span class="asdfchildspan"></span>
        </div>
        <div nn-for="i in nestedArr" class="asdf2">
            <div nn-for="j in i" class="jdiv"></div>
        </div>
    </body>`;
});

test("initial render: resolveFor returns correct related/unrelated html", () => {
  const forNode = document.querySelector(".asdf");
  const exState = { arr: [1, 2, 3, 4] };
  const resultNodes = resolveFor(
    exState,
    forNode.getAttribute("nn-for"),
    forNode
  );
  expect(resultNodes.length).toBe(exState.arr.length);
  const testContainer = document.createElement("div");
  resultNodes.forEach((node) => {
    testContainer.appendChild(node);
  });
  expect(testContainer.querySelectorAll(".asdfchildspan").length).toBe(
    exState.arr.length * 3
  );
});

test("initial render: correctly replaces elements in dom", () => {
  const forNode = document.querySelector(".asdf");
  const exState = { arr: [1, 2, 3, 4] };
  resolveFor(exState, forNode.getAttribute("nn-for"), forNode);
  expect(document.querySelectorAll(".asdf").length).toBe(exState.arr.length);
});

test("get nn fors one level deep - recursive", () => {
  const sandbox = document.createElement("div");
  sandbox.innerHTML = `
        <div nn-for="asdf in fasd">
          one level deep
        </div>
        <div nn-for="asdf in fasd">
          one level deep
          <div nn-for="fdfdfdfd">two levels deep</div>
          <div nn-for="asdf in fasd">
            two levels deep
          </div>
        </div>
        <span class="unrelated"></span>
        <div nn-for="asdfasdf">
          one level deep
          <div nn-for="fdfdfdfd">two levels deep</div>
        </div>
  `;
  const one = getNNForsOneLvl(sandbox);
  expect(one.length).toBe(3);
  let level2total = 0;
  one.forEach((parent) => {
    level2total += getNNForsOneLvl(parent).length;
  });
  //todo: write recursive function in template_for
  expect(level2total).toBe(3);
});
