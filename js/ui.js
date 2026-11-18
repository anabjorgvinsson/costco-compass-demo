import { DATA } from './data.js?v=20261117202059';
import { PRODUCT_ICON } from './content.js?v=20261117202059';
import { CATALOG } from './inventory.js?v=20261117202059';

export const PERSONAS = DATA.personas;
export const PRODUCTS = Object.fromEntries(CATALOG.map((p) => [p.id, p]));
export const DEPTS = Object.fromEntries(DATA.warehouse.departments.map((d) => [d.id, d]));
export const DEPT_COLORS = DATA.warehouse.visualLegend;

/** Strip fixture qualifiers like "(demo)" / "Example Warehouse" for in-app display. */
export const clean = (s) => String(s ?? '')
  .replace(/\s*\((fictional )?demo( only)?\)/gi, '').replace(/Example Warehouse/g, 'Nashville Warehouse')
  .replace(/\s*This demo only shows fictional pickup logistics\./g, '').replace(/demo warehouse/g, 'warehouse')
  .replace(/^Illustrative laptop for comparison; not automatically/, 'Laptop to compare in store; not');
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = (n) => '$' + (Math.round(n * 100) / 100).toFixed(2);
export const moneyShort = (n) => '$' + Math.round(n).toLocaleString('en-US');

const UNIT_WORD = { rolls: 'roll', loads: 'load', bottles: 'bottle', count: 'ea', lb: 'lb', gallons: 'gal', oz: 'oz', boxes: 'box', jars: 'jar', bars: 'bar', sheets: 'sheet', chicken: 'ea', laptop: 'ea', bottle: 'bottle' };
/** Unit price from a fixture unit label, e.g. "12 rolls" → { value: 1.67, unit: 'roll' }. */
export function unitPrice(p) {
  const m = /^([\d.]+)\s+(\w+)/.exec(p.unitLabel || '');
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!n || n === 1) return null;
  return { value: p.demoPriceUsd / n, unit: UNIT_WORD[m[2]] || m[2] };
}
export const unitPriceText = (p) => {
  const u = unitPrice(p);
  return u ? `${u.value < 0.1 ? '$' + u.value.toFixed(3) : money(u.value)}/${u.unit}` : '';
};

const P = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  cart: '<path d="M3 4h2l2.4 11.2a1 1 0 001 .8h9.2a1 1 0 001-.8L20 8H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7a3 3 0 000-6H9a3 3 0 010-6h7"/>',
  bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  gem: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M9 4l3 16M15 4l-3 16"/>',
  refresh: '<path d="M20 11a8 8 0 10-2.3 5.7"/><path d="M20 4v7h-7"/>',
  zoomIn: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>',
  zoomOut: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8 11h6"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  send: '<path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/>',
  cross: '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/>',
  scale: '<path d="M12 3v18M5 7h14M8 21h8"/><path d="M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  door: '<path d="M4 21h16M6 21V4h9v17"/><circle cx="12.5" cy="12.5" r=".8"/><path d="M18 8l3 3-3 3"/>',
  // product category icons
  baby: '<circle cx="12" cy="9" r="5"/><path d="M10 9h.01M14 9h.01M10.5 11.5c.8.6 2.2.6 3 0"/><path d="M7 21c0-3 2.2-5 5-5s5 2 5 5"/>',
  roll: '<ellipse cx="8" cy="12" rx="4" ry="7"/><path d="M8 5h9a4 7 0 010 14H8"/><circle cx="8" cy="12" r="1.3"/>',
  bottle: '<path d="M10 3h4v3l2 2v12a1 1 0 01-1 1H9a1 1 0 01-1-1V8l2-2z"/><path d="M8 12h8"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z"/>',
  bag: '<path d="M5 8h14l-1.2 12a1 1 0 01-1 .9H7.2a1 1 0 01-1-.9z"/><path d="M9 8V6a3 3 0 016 0v2"/>',
  sponge: '<rect x="3" y="8" width="18" height="9" rx="2"/><path d="M3 12h18M7 15h.01M11 15h.01M15 15h.01"/>',
  milk: '<path d="M8 3h8v3l2 3v11a1 1 0 01-1 1H7a1 1 0 01-1-1V9l2-3z"/><path d="M6 12h12"/>',
  egg: '<path d="M12 3c3.5 0 6 6 6 10a6 6 0 01-12 0c0-4 2.5-10 6-10z"/>',
  cup: '<path d="M5 6h14l-1.5 13a2 2 0 01-2 1.8h-7a2 2 0 01-2-1.8z"/><path d="M4 6h16"/>',
  leaf: '<path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z"/><path d="M5 19l8-8"/>',
  apple: '<path d="M12 7c-2-1.5-7-1-7 5 0 4 3 9 5 9 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 5-5 5-9 0-6-5-6.5-7-5z"/><path d="M12 7c0-2 1-4 3-4"/>',
  drumstick: '<path d="M14 4a6 6 0 016 6c0 4-4 6-7 5l-4 4a2 2 0 11-3-1 2 2 0 11-1-3l4-4c-1-3 1-7 5-7z"/>',
  snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
  grain: '<path d="M12 21V8"/><path d="M12 8c-3 0-4-2-4-5 3 0 4 2 4 5zM12 8c3 0 4-2 4-5-3 0-4 2-4 5zM12 13c-3 0-4-2-4-4 3 0 4 1.5 4 4zM12 13c3 0 4-2 4-4-3 0-4 1.5-4 4z"/>',
  jar: '<rect x="6" y="7" width="12" height="14" rx="2"/><path d="M7 3h10v4H7zM6 12h12"/>',
  bar: '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M8 8v8M16 8v8"/>',
  mug: '<path d="M4 8h12v8a4 4 0 01-4 4H8a4 4 0 01-4-4z"/><path d="M16 10h2a2 2 0 010 4h-2M8 3v2M12 3v2"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1"/><path d="M2 19h20l-2-4H4z"/>',
  paper: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
  gift: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8c-2-4-6-4-6-1.5S10 8 12 8zM12 8c2-4 6-4 6-1.5S14 8 12 8z"/>',
  chair: '<path d="M7 3h10v9H7zM5 12h14M8 12v9M16 12v9M6 17h12"/>',
  tv: '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M8 21h8M12 17v4"/>',
  headphones: '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
  tree: '<path d="M12 3l6 8h-3l4 6H5l4-6H6z"/><path d="M12 17v4"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  nutrition: '<path d="M12 21c-4.5 0-8-3-8-7.5C4 8 8 5 12 7c4-2 8 1 8 6.5 0 4.5-3.5 7.5-8 7.5z"/><path d="M12 7c0-2 1-4 3-4"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || P.info}</svg>`;

const DEPT_ICON = { paper: 'roll', cleaning: 'bottle', beverages: 'bottle', frozen: 'snow', pharmacy: 'plus', deli: 'drumstick', refrigerated: 'milk', seasonal: 'gift', pantry: 'jar', meat: 'drumstick', dairy: 'leaf', furniture: 'chair', electronics: 'tv', office: 'paper', optical: 'eye' };
const EXTRA_ICON = { 'baby-wipes': 'baby', water: 'bottle', 'sparkling-water': 'bottle', 'k-cups': 'mug', 'cold-brew': 'mug', 'green-tea': 'mug', croissants: 'grain', muffins: 'grain', bagels: 'grain', 'pumpkin-pie': 'grain', headphones: 'headphones', tablet: 'laptop', 'portable-ssd': 'laptop', 'usb-c-cables': 'bolt', 'xmas-tree': 'tree', 'string-lights': 'sparkle', 'peanut-butter': 'jar', 'olive-oil': 'bottle', 'mixed-nuts': 'jar', 'shredded-cheese': 'milk', 'string-cheese': 'milk', butter: 'milk', avocados: 'leaf', strawberries: 'apple', toothpaste: 'drop', 'hand-soap': 'drop', shampoo: 'bottle', sunscreen: 'bottle' };
export const productIcon = (id) => icon(PRODUCT_ICON[id] || EXTRA_ICON[id] || DEPT_ICON[PRODUCTS[id]?.departmentId] || 'bag');

/** Costco Compass logo: compass mark + wordmark. `tone` = 'light' (on blue) or 'dark' (on white). */
export function logo(tone = 'light', size = '') {
  return `<span class="logo logo-${tone} ${size}" aria-label="Costco Compass, student concept">
    <svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" fill="#073B8E" stroke="#E2B13C" stroke-width="2.6"/>
      <circle cx="20" cy="20" r="13" fill="none" stroke="#E2B13C" stroke-width="1" stroke-dasharray="1.5 3.2" opacity=".85"/>
      <path d="M20 6.5l4.2 13.5H15.8z" fill="#E2B13C"/>
      <path d="M20 33.5l-4.2-13.5h8.4z" fill="#ffffff"/>
      <circle cx="20" cy="20" r="2.4" fill="#D7193F"/>
    </svg>
    <span class="logo-word"><b>Costco</b><i>Compass</i></span>
  </span>`;
}

export const productName = (id) => PRODUCTS[id]?.name || id;
export const deptLabel = (id) => DEPTS[id]?.label || id;
