import { JSDOM } from 'jsdom';
import { nn } from '../src/typescript/fw/construct';
import { nnHTMLElement } from '../src/typescript/typedefs';
let dom;
let document : JSDOM["window"]["document"];
beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html>
        <body><p id="main">jsdom</p> <div id="app"></div></body>`);
    document = dom.window.document;
});

test('jsdom loads', () => {
    expect(document.getElementById('main').textContent).toBe('jsdom');
});

test('nn attaches', () => {
    new nn({
        el: "#app",
        jsDocument: document
    });
    const el : nnHTMLElement = document.getElementById('app') as nnHTMLElement;
    expect(el).toHaveProperty('__nn__');
    expect(el.__nn__.$el).toBe(el);
});