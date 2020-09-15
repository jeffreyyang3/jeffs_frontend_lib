import { nn } from "../src/typescript/fw/construct";
import { nnHTMLElement } from "../src/typescript/typedefs";
beforeEach(() => {
  document.body.innerHTML = `<!DOCTYPE html>
        <body>
        <div id="app">
        <h1 id="asdf" nn-txt="asdf"></h1>
        <span id="n1n2" nn-txt="n1n2"></span>
        <span id="n1" nn-txt="n1"></span>
        </div>
    </body>`;
});

test("reactive node shows data on initial load", () => {
  new nn({
    el: "#app",
    data: {
      asdf: "fasd",
    },
  });
  expect(document.getElementById("asdf").innerHTML).toBe("fasd");
});

test("reactive node content changes when nn state data prop changed", () => {
  const x = new nn({
    el: "#app",
    data: {
      asdf: "fasd",
    },
  });
  expect(document.getElementById("asdf").innerHTML).toBe("fasd");
  x.state.asdf = "cool";
  expect(document.getElementById("asdf").innerHTML).toBe("cool");
});

test("reactive node with computed property", () => {
  const x = new nn({
    el: "#app",
    data: {
      n1: 1,
      n2: 2,
    },
    computed: {
      n1n2: {
        fn: function() {
          return this.state.n1 + this.state.n2;
        },
        dependencies: ["n1", "n2"],
      },
    },
  });
  expect(x.state.n1n2).toBe(3);
  expect(Number(document.getElementById("n1").innerHTML)).toBe(1);
  expect(Number(document.getElementById("n1n2").innerHTML)).toBe(3);
  x.state.n1 = 10;
  expect(Number(document.getElementById("n1").innerHTML)).toBe(10);
  expect(Number(document.getElementById("n1n2").innerHTML)).toBe(12);
});
