import test from 'node:test';
import assert from 'node:assert/strict';
import { attributes, checkPage } from './audit-site.mjs';

const url = 'https://example.com/page/';
const html = `<!doctype html><html><head><title>Example</title>
<meta name="description" content="Example page">
<link rel="canonical" href="${url}"></head><body><h1>Example</h1></body></html>`;

test('valid page and either quote style are accepted', () => {
  checkPage(html, url);
  checkPage(html.replaceAll('"', "'"), url);
  assert.equal(attributes('<link REL="canonical" href="/">').rel, 'canonical');
});

test('indexing restrictions are rejected', () => {
  for (const value of ['noindex', 'none', 'follow, noindex']) {
    assert.throws(() => checkPage(html.replace('</head>', `<meta name="robots" content="${value}"></head>`), url));
  }
});

test('missing, duplicate, or wrong canonical is rejected', () => {
  assert.throws(() => checkPage(html.replace(/<link[^>]+>/, ''), url));
  assert.throws(() => checkPage(html.replace('</head>', `<link rel="canonical" href="${url}"></head>`), url));
  assert.throws(() => checkPage(html, 'https://example.com/other/'));
});

test('missing search metadata is rejected', () => {
  assert.throws(() => checkPage(html.replace(/<title>.*?<\/title>/, ''), url));
  assert.throws(() => checkPage(html.replace(/<meta[^>]+>/, ''), url));
});
