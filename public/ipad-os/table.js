// Major versions only; min is the shipping OS family, max is the last compatible family.
const versions = [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,26,27];
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
const families = [...document.querySelectorAll('input[name="family"]')];
const hideOld = document.querySelector('#hide-old');
// Actual CVE-linked releases, not promised support end dates. Reviewed 2026-11-14.
const securityReleases = {
  15: { version: '15.8.8', date: '2026-05-11', through: 26 },
  16: { version: '16.7.16', date: '2026-05-11', through: 26 },
  17: { version: '17.7.11', date: '2026-05-11', through: 26 },
  18: { version: '18.7.12', date: '2026-11-09', through: 27 },
  26: { version: '26.7.3', date: '2026-11-09', through: 27 },
  27: { version: '27.2.1', date: '2026-11-09', through: 27 }
};
// Include the OS generation immediately before the oldest recently patched OS.
const oldestPatched = Math.min(...Object.keys(securityReleases).map(Number));
const oldestVisible = versions[versions.indexOf(oldestPatched) - 1];
hideOld.title = `直近1年にセキュリティ修正を確認したOSと、その1世代前（iPadOS ${oldestVisible}）まで表示`;
const head = document.querySelector('thead');
head.innerHTML = '<tr><th scope="col">機種（発売年）</th>' + versions.map(v => `<th scope="col"><small>${v < 13 ? 'iOS' : 'iPadOS'}</small>${v}</th>`).join('') + '<th scope="col" class="security-date">最終修正確認</th></tr>';
function render() {
  const selected = new Set(families.filter(input => input.checked).map(input => input.value));
  const visible = models.filter(m => selected.has(m[0]) && (!hideOld.checked || m[4] >= oldestVisible));
  document.querySelector('tbody').innerHTML = visible.map(([,name,year,min,max]) => {
    const security = securityReleases[max];
    const cells = versions.map(v => {
      if (v >= min && v <= max) return '<td class="yes">〇</td>';
      if (security && v > max && v <= security.through) return `<td class="security" title="iPadOS ${security.version} の修正を ${security.date} に確認。この列のOSには非対応。">△</td>`;
      return '<td>—</td>';
    }).join('');
    return `<tr><th scope="row">${name}（${year}年）</th>${cells}<td class="security-date">${security ? `<time datetime="${security.date}">${security.date}</time><small>iPadOS ${security.version}</small>` : '未確認'}</td></tr>`;
  }).join('');
  document.querySelector('#count').textContent = `${visible.length}機種`;
}
families.forEach(input => input.addEventListener('change', render));
hideOld.addEventListener('change', render);
// Leave touch gestures native; mouse dragging moves the OS axis only.
let drag = null;
scroller.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
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
