import nn from "../src/typescript/fw/construct";
beforeEach(() => {
  document.body.innerHTML = `<!DOCTYPE html>
        <body>
        <div id="app">
            <div nn-for="i in arr" class="forNode">
                <span nn-for="i"></span>
            </div>
        </div>
    </body>`;
});

test("for creates correct number of elements", () => {
  const x = new nn({
    el: "#app",
    data: {
      arr: [1, 2, 3, 4],
    },
  });
  expect(document.querySelectorAll(".forNode").length).toBe(x.state.arr.length);
});

test("for creates correct number of elements", () => {
  const x = new nn({
    el: "#app",
    data: {
      arr: [1, 2, 3, 4],
    },
  });
  const forNodes = document.querySelectorAll(".forNode");
  expect(forNodes.length).toBe(x.state.arr.length);
  forNodes.forEach((forNode, forNodeIdx) => {
    forNode.querySelectorAll("span[nn-for]").forEach((iterRefSpan) => {
      expect(Number(iterRefSpan.innerHTML)).toBe(x.state.arr[forNodeIdx]);
    });
  });
});
