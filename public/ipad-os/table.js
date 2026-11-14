// Major versions only; min is the shipping OS family, max is the last compatible family.
const versions = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,26,27];
const releaseYears = {3:2010,4:2010,5:2011,6:2012,7:2013,8:2014,9:2015,10:2016,11:2017,12:2018,13:2019,14:2020,15:2021,16:2022,17:2023,18:2024,26:2025,27:2026};
const models = [
  ['iPad','iPad (A16)',2025,18,27],
  ['iPad','iPad 第10世代',2022,16,27],
  ['iPad','iPad 第9世代',2021,15,27],
  ['iPad','iPad 第8世代',2020,14,26],
  ['iPad','iPad 第7世代',2019,13,18],
  ['iPad','iPad 第6世代',2018,11,17],
  ['iPad','iPad 第5世代',2017,10,16],
  ['iPad','iPad 第4世代',2012,6,10],
  ['iPad','iPad 第3世代',2012,5,9],
  ['iPad','iPad 2',2011,4,9],
  ['iPad','iPad 第1世代',2010,3,5],
  ['Air','iPad Air 13インチ (M4)',2026,26,27],
  ['Air','iPad Air 11インチ (M4)',2026,26,27],
  ['Air','iPad Air 13インチ (M3)',2025,18,27],
  ['Air','iPad Air 11インチ (M3)',2025,18,27],
  ['Air','iPad Air 13インチ (M2)',2024,17,27],
  ['Air','iPad Air 11インチ (M2)',2024,17,27],
  ['Air','iPad Air 第5世代',2022,15,27],
  ['Air','iPad Air 第4世代',2020,14,27],
  ['Air','iPad Air 第3世代',2019,12,26],
  ['Air','iPad Air 2',2014,8,15],
  ['Air','iPad Air 第1世代',2013,7,12],
  ['mini','iPad mini (A20 Pro)',2026,27,27],
  ['mini','iPad mini (A17 Pro)',2024,18,27],
  ['mini','iPad mini 第6世代',2021,15,27],
  ['mini','iPad mini 第5世代',2019,12,26],
  ['mini','iPad mini 4',2015,9,15],
  ['mini','iPad mini 3',2014,8,12],
  ['mini','iPad mini 2',2013,7,12],
  ['mini','iPad mini 第1世代',2012,6,9],
  ['Pro','iPad Pro 13インチ (M5)',2025,26,27],
  ['Pro','iPad Pro 11インチ (M5)',2025,26,27],
  ['Pro','iPad Pro 13インチ (M4)',2024,17,27],
  ['Pro','iPad Pro 11インチ (M4)',2024,17,27],
  ['Pro','iPad Pro 12.9インチ 第6世代',2022,16,27],
  ['Pro','iPad Pro 11インチ 第4世代',2022,16,27],
  ['Pro','iPad Pro 12.9インチ 第5世代',2021,14,27],
  ['Pro','iPad Pro 11インチ 第3世代',2021,14,27],
  ['Pro','iPad Pro 12.9インチ 第4世代',2020,13,27],
  ['Pro','iPad Pro 11インチ 第2世代',2020,13,27],
  ['Pro','iPad Pro 12.9インチ 第3世代',2018,12,26],
  ['Pro','iPad Pro 11インチ 第1世代',2018,12,26],
  ['Pro','iPad Pro 12.9インチ 第2世代',2017,10,17],
  ['Pro','iPad Pro 10.5インチ',2017,10,17],
  ['Pro','iPad Pro 9.7インチ',2016,9,16],
  ['Pro','iPad Pro 12.9インチ 第1世代',2015,9,16]
];
const scroller = document.querySelector('.matrix');
const affiliateLinks = {
  'iPad 第8世代': 'https://hb.afl.rakuten.co.jp/ichiba/597f040e.845f8734.597f040f.2c119af7/_RTLink131223?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Faiacross%2Fipad8-128gb-gold%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjY0eDY0IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D',
  'iPad 第10世代': 'https://hb.afl.rakuten.co.jp/ichiba/52fc2c79.d509a37d.52fc2c7a.2f8eff5b/_RTLink131223?pc=https%3A%2F%2Fproduct.rakuten.co.jp%2Fproduct%2F-%2F1aec32247c925ff2542ed2b1d0ee980a%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjY0eDY0IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjoxLCJhbXAiOmZhbHNlfQ%3D%3D',
  'iPad (A16)': 'https://hb.afl.rakuten.co.jp/ichiba/52fc2c79.d509a37d.52fc2c7a.2f8eff5b/_RTLink131223?pc=https%3A%2F%2Fproduct.rakuten.co.jp%2Fproduct%2F-%2F57f2e1f59af33f0f2fa7034b3d9c385c%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjY0eDY0IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjoxLCJhbXAiOmZhbHNlfQ%3D%3D',
  'iPad 第9世代': 'https://hb.afl.rakuten.co.jp/ichiba/53054539.5321ec00.5305453a.73a7fe7c/_RTLink131223?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fnicosuma-store%2Fipd-9gn-64-a%2F&link_type=hybrid_url&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJoeWJyaWRfdXJsIiwic2l6ZSI6IjY0eDY0IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D'
};
const families = [...document.querySelectorAll('input[name="family"]')];
// Actual CVE-linked releases, not promised support end dates. Reviewed 2026-11-14.
const securityReleases = {
  5: { version: '5.1.1', date: '2012-05-07', through: 5 },
  9: { version: '9.3.5', date: '2016-08-25', through: 9 },
  10: { version: '10.3.3', date: '2017-07-19', through: 10 },
  12: { version: '12.5.7', date: '2023-01-23', through: 16 },
  15: { version: '15.8.8', date: '2026-05-11', through: 26 },
  16: { version: '16.7.16', date: '2026-05-11', through: 26 },
  17: { version: '17.7.11', date: '2026-05-11', through: 26 },
  18: { version: '18.7.12', date: '2026-11-09', through: 27 },
  26: { version: '26.7.3', date: '2026-11-09', through: 27 },
  27: { version: '27.2.1', date: '2026-11-09', through: 27 }
};
const head = document.querySelector('thead');
head.innerHTML = '<tr><th scope="col"><span class="desktop-label">機種（発売年）</span><span class="mobile-label" aria-hidden="true">機種</span></th>' + versions.map(v => `<th scope="col" aria-label="${v < 13 ? 'iOS' : 'iPadOS'} ${v}、${releaseYears[v]}年"><small>${v < 13 ? 'iOS' : 'iPadOS'}</small>${v}<small><span class="desktop-label">（${releaseYears[v]}年）</span><span class="mobile-label" aria-hidden="true">(${String(releaseYears[v]).slice(-2)})</span></small></th>`).join('') + '</tr>';
function shortModelName(name) {
  return name.replace(/^iPad (Air|mini|Pro)/, '$1')
    .replace(/インチ/g, '')
    .replace(/第(\d+)世代/g, '$1世代')
    .replace(/第1世代/g, '初代');
}
function render() {
  const selected = new Set(families.filter(input => input.checked).map(input => input.value));
  const visible = models.filter(m => selected.has(m[0]));
  document.querySelector('tbody').innerHTML = visible.map(([,name,year,min,max]) => {
    const security = securityReleases[max];
    const cells = versions.map(v => {
      if (v >= min && v <= max) return '<td class="yes">〇</td>';
      if (security && v > max && v <= security.through) {
        const os = max < 13 ? 'iOS' : 'iPadOS';
        return `<td class="security" title="${os} ${security.version}：${security.date} に修正確認。この列のOSには非対応。">△</td>`;
      }
      return '<td>—</td>';
    }).join('');
    const purchaseLabel = ['iPad 第8世代', 'iPad 第9世代'].includes(name) ? '中古・楽天' : '楽天で比較';
    const purchase = affiliateLinks[name] ? `<a class="purchase-link" href="${affiliateLinks[name]}" target="_blank" rel="nofollow sponsored noopener" aria-label="${name}：${purchaseLabel}（広告・新しいタブ）">${purchaseLabel} ↗</a>` : '';
    return `<tr><th scope="row" aria-label="${name}、${year}年発売"><span class="desktop-label">${name}（${year}年）</span><span class="mobile-label" aria-hidden="true">${shortModelName(name)}</span>${purchase}</th>${cells}</tr>`;
  }).join('');
  document.querySelector('#count').textContent = `${visible.length}機種`;
}
families.forEach(input => input.addEventListener('change', render));
// Leave touch gestures native; mouse dragging moves the OS axis only.
let drag = null;
scroller.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  if (event.target.closest('a')) return;
  const bounds = scroller.getBoundingClientRect();
  if (event.clientX >= bounds.left + scroller.clientWidth || event.clientY >= bounds.top + scroller.clientHeight) return;
  drag = { id: event.pointerId, x: event.clientX, left: scroller.scrollLeft };
  scroller.setPointerCapture(event.pointerId);
  scroller.classList.add('dragging');
  event.preventDefault();
});
scroller.addEventListener('pointermove', event => {
  if (!drag || drag.id !== event.pointerId) return;
  scroller.scrollLeft = drag.left - (event.clientX - drag.x);
});
function stopDrag(event) {
  if (!drag || drag.id !== event.pointerId) return;
  drag = null;
  scroller.classList.remove('dragging');
  if (scroller.hasPointerCapture(event.pointerId)) scroller.releasePointerCapture(event.pointerId);
}
scroller.addEventListener('pointerup', stopDrag);
scroller.addEventListener('pointercancel', stopDrag);
scroller.addEventListener('lostpointercapture', stopDrag);
render();
requestAnimationFrame(() => { scroller.scrollLeft = scroller.scrollWidth; });
