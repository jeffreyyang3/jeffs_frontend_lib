import { JSDOM } from 'jsdom';
const dom = new JSDOM(`<!DOCTYPE html>
<body><p id="main">jsdom</p></body>`);
import { nn } from '../src/typescript/fw/construct';
const document = dom.window.document;
test('jsdom loads', () => {
    expect(document.getElementById('main').textContent).toBe('jsdom');
});
