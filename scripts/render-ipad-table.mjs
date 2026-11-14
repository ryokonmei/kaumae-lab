import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const folder = new URL('../public/ipad-os/', import.meta.url);
const elements = new Map();
const families = ['iPad', 'Air', 'mini', 'Pro'].map(value => ({ value, checked: true, addEventListener() {} }));
const document = {
  querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, { innerHTML: '', textContent: '', addEventListener() {} });
    return elements.get(selector);
  },
  querySelectorAll() { return families; }
};
// Reuse the browser renderer so the crawlable HTML and interactive table agree.
vm.runInNewContext(readFileSync(new URL('table.js', folder), 'utf8'), { document, requestAnimationFrame() {} });
const path = fileURLToPath(new URL('index.html', folder));
const html = readFileSync(path, 'utf8')
  .replace(/<thead>[\s\S]*?<\/thead>/, `<thead>${elements.get('thead').innerHTML}</thead>`)
  .replace(/<tbody>[\s\S]*?<\/tbody>/, `<tbody>${elements.get('tbody').innerHTML}</tbody>`)
  .replace(/<span id="count">[\s\S]*?<\/span>/, `<span id="count">${elements.get('#count').textContent}</span>`);
writeFileSync(path, html);
console.log('Rendered 46 iPad rows into public/ipad-os/index.html');
