// Product detail, nutrition label, mock aisle rendering and inventory list.
import { esc, icon, money, productIcon, PRODUCTS, DEPTS, unitPriceText } from '../ui.js';
import { AISLES, SLOT_NAMES, CATALOG, locationOf, stockText, stockShort, restockText } from '../inventory.js';
import { nutritionOf, highlightsOf, goalFit } from '../details.js';
import { state, cartLine } from '../state.js';

export const stockPill = (p) => `<span class="stock ${p.stock}">${stockShort(p)}</span>`;
export const deptItems = (deptId) => CATALOG.filter((p) => p.departmentId === deptId);

export function nutritionLabel(id) {
  const n = nutritionOf(id);
  if (!n) return '';
  const row = (k, v, cls = '') => `<div class="nf-row ${cls}"><span>${k}</span><b>${v}</b></div>`;
  return `<div class="nf" aria-label="Nutrition facts">
    <div class="nf-title">Nutrition Facts</div>
    <div class="nf-serv">${n.servings} servings per container<br><b>Serving size</b> <b class="r">${esc(n.serving)}</b></div>
    <div class="nf-cal"><span>Calories</span><b>${n.calories}</b></div>
    ${row('Total Fat', `${n.fat} g`)}${row('Sodium', `${n.sodium} mg`)}${row('Total Carbohydrate', `${n.carbs} g`)}
    ${row('Dietary Fiber', `${n.fiber} g`, 'ind')}${row('Total Sugars', `${n.sugars} g`, 'ind')}${row('Protein', `${n.protein} g`, 'strong')}
    <div class="nf-foot">Always check the package label.</div>
  </div>`;
}

/** Full product detail card. */
export function productDetail(id, { compact = false } = {}) {
  const p = PRODUCTS[id];
  const loc = locationOf(p);
  const line = cartLine(id);
  const fit = state.personaId ? goalFit(state.personaId, p, unitPriceText) : '';
  const up = unitPriceText(p);
  const isLaptop = p.kind === 'electronics' && (p.id === 'laptop-a' || p.id === 'laptop-b');
  const found = state.foundIds.includes(id);
  let action;
  if (isLaptop) action = state.savedComparisonIds.length
    ? `<span class="added">${icon('check')}In your laptop comparison</span>`
    : `<button class="btn outline full" data-action="save-comparison">${icon('pin')}Save to compare in store</button>`;
  else if (line) action = `<div class="pd-acts"><span class="added">${icon('check')}On your list · qty ${line.quantity}</span>
      <button class="btn-chip ${found ? '' : 'gold'}" data-action="toggle-found-btn" data-id="${id}">${icon('check')}${found ? 'Found ✓' : 'Mark found'}</button></div>`;
  else if (p.stock === 'out') action = `<button class="btn full" disabled>${icon('x')}Out of stock — can't add</button>`;
  else action = `<button class="btn red full" data-action="add-item" data-id="${id}" data-source="manual">${icon('plus')}Add to my list · ${money(p.demoPriceUsd)}</button>`;

  return `<div class="pd ${compact ? 'compact' : ''}" id="pd-${id}">
    <div class="pd-top"><div class="pi lg">${productIcon(id)}</div>
      <div class="pd-main"><div class="tiny muted">Item ${p.itemNo}</div><h4>${esc(p.name)}</h4>
        <div class="pd-price"><b>${money(p.demoPriceUsd)}</b><span>${esc(p.unitLabel)}${up ? ` · ${up}` : ''}</span></div></div></div>
    <div class="pd-stock">${stockPill(p)}<span>${icon('pin')}${esc(loc.text)}</span></div>
    <p class="tiny muted pd-qty">${esc(stockText(p))}${restockText(p) ? ` · ${esc(restockText(p))}` : ''}</p>
    ${fit ? `<div class="pd-fit">${icon('target')}<span><b>For your goal:</b> ${esc(fit)}</span></div>` : ''}
    <ul class="pd-hl">${highlightsOf(p, unitPriceText).map((h) => `<li>${icon('check')}${esc(h)}</li>`).join('')}</ul>
    ${nutritionLabel(id)}
    ${action}
  </div>`;
}

export function productModal(id) {
  return `<div class="overlay" data-action="close-modal"></div>
  <div class="modal product-modal" role="dialog" aria-modal="true" aria-label="${esc(PRODUCTS[id].name)}">
    <div class="sheet-head"><span class="eyebrow">${icon('info')} Product details</span><button class="icon-btn" data-action="close-modal" aria-label="Close">${icon('x')}</button></div>
    ${productDetail(id)}
  </div>`;
}

/** Illustrated aisle: 4 bays × 3 levels, products placed by mock inventory. */
export function aisleScene(deptId) {
  const a = AISLES[deptId];
  const names = SLOT_NAMES[a.style] || SLOT_NAMES.rack;
  const items = deptItems(deptId);
  const at = (b, l) => items.find((p) => p.bay === b && p.level === l);
  const bays = [0, 1, 2, 3].map((b) => `<div class="bay"><div class="bay-tag">${names.bay(b)}</div>
    ${[0, 1, 2].map((l) => {
      const p = at(b, l);
      if (!p) return `<div class="shelf"><div class="slot ${l === 0 ? 'overstock' : 'empty'}">${l === 0 ? `<span class="boxes"><i></i><i></i><i></i></span><small>Overstock</small>` : '<small>—</small>'}</div></div>`;
      const mine = !!cartLine(p.id) || (state.savedComparisonIds.includes(p.id));
      const found = state.foundIds.includes(p.id);
      const cls = ['slot', 'prod', p.stock, mine ? 'mine' : '', found ? 'found' : '', state.ui.sheetFocus === p.id ? 'focus' : ''].join(' ');
      return `<div class="shelf"><button class="${cls}" data-action="focus-item" data-id="${p.id}" aria-label="${esc(p.name)}, ${money(p.demoPriceUsd)}, ${stockShort(p)}${mine ? ', on your list' : ''}">
        ${mine ? `<span class="flag">${found ? icon('check') : 'ON LIST'}</span>` : ''}
        ${p.stock !== 'in' ? `<span class="sflag ${p.stock}">${p.stock === 'out' ? 'OUT' : 'LOW'}</span>` : ''}
        <span class="slot-ic">${productIcon(p.id)}</span>
        <span class="slot-name">${esc(p.short)}</span>
        <span class="tag-price">${money(p.demoPriceUsd)}</span>
      </button></div>`;
    }).join('')}
  </div>`).join('');
  return `<div class="aisle ${a.style}">
    <div class="aisle-sign"><b>${esc(a.aisle.toUpperCase())}</b><span>${esc(DEPTS[deptId].label)}</span></div>
    <div class="rack-scroll" id="rack-scroll"><div class="racks">${bays}</div></div>
    <div class="aisle-floor"><span>${icon('route')}Swipe to walk the aisle →</span><span class="key"><i class="k-mine"></i>Your list <i class="k-low"></i>Low <i class="k-out"></i>Out</span></div>
  </div>`;
}

export function inventoryList(deptId) {
  return `<ul class="inv-list">${deptItems(deptId).map((p) => {
    const line = cartLine(p.id);
    const loc = locationOf(p);
    return `<li><button class="inv-row ${state.ui.sheetFocus === p.id ? 'focus' : ''}" data-action="focus-item" data-id="${p.id}">
      <span class="pi sm">${productIcon(p.id)}</span>
      <span class="inv-main"><b>${esc(p.short)}</b><span class="tiny muted">${esc(loc.bay)} · ${esc(loc.level)}</span></span>
      <span class="inv-side"><b>${money(p.demoPriceUsd)}</b>${line ? `<span class="added">${icon('check')}List</span>` : stockPill(p)}</span>
    </button></li>`;
  }).join('')}</ul>`;
}

export function deptStats(deptId) {
  const items = deptItems(deptId);
  return { n: items.length, low: items.filter((p) => p.stock === 'low').length, out: items.filter((p) => p.stock === 'out').length };
}

/** Inventory search across the whole mock warehouse. */
export function searchInventory(q) {
  const t = q.trim().toLowerCase();
  if (t.length < 2) return [];
  const words = t.split(/\s+/);
  return CATALOG.filter((p) => {
    const hay = `${p.name} ${p.short} ${(p.tags || []).join(' ')} ${DEPTS[p.departmentId].label}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  }).slice(0, 6);
}

export { AISLES };
