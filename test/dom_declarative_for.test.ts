import { resolveFor } from "../src/typescript/fw/dom/template_for";
beforeEach(() => {
    document.body.innerHTML = `<!DOCTYPE html>
        <body>
        <div nn-for="i in arr" class="asdf"></div>
    </body>`;
});

test("basic: resolveFor returns correct # of new elements", () => {
    const forNode = document.querySelector('.asdf');
    const exState = {arr: [1,2,3,4]}
    const resultNodes = resolveFor(
        exState,
        forNode.getAttribute('nn-for'),
        forNode
    );
    expect(resultNodes.length).toBe(exState.arr.length);
});
