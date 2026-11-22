import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const origin = 'https://kaumae-lab.pages.dev';
const normalize = text => text.replace(/\r\n/g, '\n').trim();

export function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)]
    .map(([, key, , value]) => [key.toLowerCase(), value]));
}

export function checkPage(html, url) {
  assert.match(html, /<!doctype html>/i, `${url}: missing doctype`);
  assert.match(html, /<title>\s*[^<]+<\/title>/i, `${url}: missing title`);
  assert.equal([...html.matchAll(/<h1\b/gi)].length, 1, `${url}: expected one h1`);
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag));
  assert(metas.some(meta => meta.name === 'description' && meta.content?.trim()), `${url}: missing description`);
  for (const meta of metas) {
    if (/^(robots|googlebot)$/i.test(meta.name || '')) {
      assert(!/\b(noindex|none)\b/i.test(meta.content || ''), `${url}: indexing blocked`);
    }
  }
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag))
    .filter(link => /(?:^|\s)canonical(?:\s|$)/i.test(link.rel || ''));
  assert.equal(canonicals.length, 1, `${url}: expected one canonical`);
  assert.equal(canonicals[0].href, url, `${url}: wrong canonical`);
}

function discover(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap(entry => {
    const path = resolve(folder, entry.name);
    return entry.isDirectory() ? discover(path) : entry.name === 'index.html' ? [path] : [];
  });
}

async function request(path, userAgent) {
  const response = await fetch(origin + path, {
    redirect: 'manual', signal: AbortSignal.timeout(20000),
    headers: userAgent ? { 'User-Agent': userAgent } : {}
  });
  return { status: response.status, headers: response.headers, body: await response.text() };
}

export async function audit(live = false) {
  const pages = new Map(discover(root).map(file => {
    const path = '/' + relative(root, file).split(sep).join('/').replace(/index\.html$/, '');
    return [path, readFileSync(file, 'utf8')];
  }));
  const assets = new Set();
  const links = new Map();
  for (const [path, html] of pages) {
    checkPage(html, origin + path);
    links.set(path, []);
    for (const [tag] of html.matchAll(/<(?:a|link|script|img)\b[^>]*>/gi)) {
      const attr = attributes(tag);
      const value = attr.href || attr.src;
      if (!value || /^(?:#|mailto:|tel:|data:)/i.test(value)) continue;
      const url = new URL(value.replace(/&amp;/g, '&'), origin + path);
      if (url.origin !== origin) continue;
      const local = resolve(root, '.' + decodeURIComponent(url.pathname));
      assert(local === root || local.startsWith(root + sep), 'Reference escapes public directory');
      assert(existsSync(local), `${path}: missing local reference ${url.pathname}`);
      if (/^<a\b/i.test(tag)) {
        if (pages.has(url.pathname)) links.get(path).push(url.pathname);
      } else if (!/canonical/i.test(attr.rel || '')) assets.add(url.pathname);
    }
    console.log(`PASS local page ${path}`);
  }
  const reached = new Set();
  function visit(path) {
    if (reached.has(path)) return;
    reached.add(path);
    for (const target of links.get(path) || []) visit(target);
  }
  visit('/');
  assert.equal(reached.size, pages.size, 'Some pages are not reachable from the homepage');
  const home = pages.get('/');
  assert.match(home, /9Qwmk1YfDdOHDpGfGMRedvlhw-nohAKOoJgeblCwVz8/, 'Ownership verification missing');
  const sitemap = readFileSync(resolve(root, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<urlset\s+xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.deepEqual(urls.sort(), [...pages.keys()].map(path => origin + path).sort(), 'Sitemap does not match pages');
  const robots = readFileSync(resolve(root, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent:\s*\*/i);
  assert(!/^Disallow:\s*\S/m.test(robots), 'Unexpected robots restriction');
  assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert(existsSync(resolve(root, '404.html')), '404.html missing; Pages would use SPA fallback');
  console.log(`PASS sitemap, robots, ownership, discovery: ${pages.size} pages`);
  if (!live) return;

  for (const path of [...pages.keys(), '/sitemap.xml', '/robots.txt', ...assets]) {
    const result = await request(path);
    assert.equal(result.status, 200, `${path}: unexpected live status`);
    assert(!/\b(noindex|none)\b/i.test(result.headers.get('x-robots-tag') || ''), `${path}: blocked by HTTP header`);
    const file = pages.has(path) ? resolve(root, '.' + path, 'index.html') : resolve(root, '.' + path);
    assert.equal(normalize(result.body), normalize(readFileSync(file, 'utf8')), `${path}: deployed content differs`);
    if (path === '/sitemap.xml') assert.match(result.headers.get('content-type'), /(?:application|text)\/xml/i);
    console.log(`PASS live content ${path}`);
  }
  // Changing the User-Agent does not emulate a verified Googlebot IP address.
  const bot = await request('/sitemap.xml', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
  assert.equal(bot.status, 200);
  assert.equal(normalize(bot.body), normalize(sitemap));
  for (const path of ['/audit-missing-page-20261122', '/ipad-os/audit-missing-page-20261122', '/missing-sitemap-audit.xml']) {
    assert.equal((await request(path)).status, 404, `${path}: missing URL must return 404`);
  }
  for (const path of ['/ipad-os', '/ipad-os/index.html']) {
    const redirect = await request(path);
    assert([301, 308].includes(redirect.status), `${path}: expected permanent redirect`);
    assert.equal(new URL(redirect.headers.get('location'), origin).href, origin + '/ipad-os/');
  }
  console.log('PASS missing URLs, canonical redirects, Googlebot-named request');
  console.log('NOTE: This audit cannot confirm Google crawling, Search Console quotas, or indexing.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  audit(process.argv.includes('--live')).catch(error => {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
  });
}
