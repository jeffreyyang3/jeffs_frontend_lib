import nn from "../src/typescript/fw/construct";
beforeEach(() => {
  document.body.innerHTML = `<!DOCTYPE html>
        <body>
        <div id="app">
            <div nn-for="i in arr" class="forNode">
                <span nn-for="i"></span>
            </div>
        </div>
        <div id="app2">
          <div nn-for="i in objArr" class="forNode2">
              <span nn-for="i.x"></span>
          </div>
        </div>
        <div id="app3">
          <div nn-for="arrArr in arrArrArr">
              <span nn-for="arr in arrArr">
                <span nn-for="num in arr">
                  <span nn-for="num" class="final"></span>
                </span>
              </span>
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
    forNode
      .querySelectorAll(".forNode > span[nn-for]")
      .forEach((iterRefSpan) => {
        expect(Number(iterRefSpan.innerHTML)).toBe(x.state.arr[forNodeIdx]);
      });
  });
});

test("evaluates for in correct order when nested iter access", () => {
  const x = new nn({
    el: "#app2",
    data: {
      objArr: [1, 2, 3, 4].map((el) => {
        return {
          x: el,
        };
      }),
    },
  });
  // would error if not going one level at a time
  const els = document.querySelectorAll(".forNode2 > span");
  els.forEach((el, idx) => {
    expect(el.innerHTML).toBe(`${idx + 1}`);
  });
});

test("multiple nested for", () => {
  const x = new nn({
    el: "#app3",
    data: {
      // @ts-ignore
      arrArrArr: [1, 2, 3].fill([1, 2, 3].fill([1, 2, 3])),
    },
  });
  const finalNodes = x.$el.querySelectorAll(".final");
  const compare = [1, 2, 3];
  expect(finalNodes.length).toBe(Math.pow(compare.length, 3));
  finalNodes.forEach((el, idx) => {
    expect(Number(el.innerHTML)).toBe(compare[idx % 3]);
  });
});
