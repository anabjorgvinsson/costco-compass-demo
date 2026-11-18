import { clean, esc, money, icon, productIcon, logo, PRODUCTS, PERSONAS, DEPTS, DEPT_COLORS, unitPriceText } from '../ui.js';
import { state, persona, cartLine, reasonFor, suggestionReason, itemCount } from '../state.js';
import { LAPTOP_SPECS } from '../content.js';

export const DISCLAIMER = 'Student concept prototype · all member data and prices are fictional.';
export const PERSONA_TINT = { sarah: '#C2410C', jake: '#0E7490', maya: '#7C3AED' };

export const avatar = (p, size = '') =>
  `<span class="avatar ${size}" style="--tint:${PERSONA_TINT[p.id]}" aria-hidden="true">${esc(p.avatarInitials)}</span>`;

export const disclaimerBar = () => '';

export const deptChip = (deptId) => {
  const d = DEPTS[deptId];
  return `<span class="dept-chip" style="--dc:${DEPT_COLORS[d.category]}">${esc(d.label)}</span>`;
};

export const membershipPill = (p) =>
  `<span class="member-pill ${/Executive/.test(p.membership) ? 'exec' : ''}">${icon('star')}${esc(clean(p.membership))}</span>`;

/** Compact product row used in chat responses and suggestion lists. */
export function productRow(id, { why, mode = 'plan' } = {}) {
  const p = PRODUCTS[id];
  const inCart = !!cartLine(id);
  let actions = '';
  if (mode === 'plan') {
    actions = inCart
      ? `<span class="added">${icon('check')}On list</span><button class="icon-btn sm" data-action="remove-item" data-id="${id}" aria-label="Remove ${esc(p.name)}">${icon('x')}</button>`
      : `<button class="btn-chip" data-action="add-item" data-id="${id}" data-source="base">${icon('plus')}Add back</button>`;
  } else if (mode === 'suggest') {
    actions = inCart
      ? `<span class="added">${icon('check')}Added</span>`
      : state.dismissedSuggestionIds.includes(id)
        ? `<span class="muted small">Dismissed</span>`
        : `<button class="btn-chip gold" data-action="add-suggestion" data-id="${id}">${icon('plus')}Add</button><button class="icon-btn sm" data-action="dismiss-suggestion" data-id="${id}" aria-label="Dismiss ${esc(p.name)}">${icon('x')}</button>`;
  }
  return `<div class="prow ${!inCart && mode === 'plan' ? 'out' : ''}">
    <div class="pi">${productIcon(id)}</div>
    <div class="prow-main">
      <button class="prow-name link-name" data-action="open-product" data-id="${id}">${esc(p.name)}</button>
      <div class="prow-meta"><b>${money(p.demoPriceUsd)}</b> · ${esc(p.unitLabel)} · ${esc(DEPTS[p.departmentId].label)}${p.stock !== 'in' ? ` · <span class="stock ${p.stock}">${p.stock === 'low' ? 'Low stock' : 'Out'}</span>` : ''}</div>
      ${why ? `<div class="prow-why">${icon('sparkle')}${esc(why)}</div>` : ''}
    </div>
    <div class="prow-act">${actions}</div>
  </div>`;
}

export function pharmacyCard(compact = false) {
  const p = persona();
  if (!p || p.id !== 'sarah') return '';
  const on = state.pharmacyStopSelected;
  return `<section class="card pharm">
    <div class="pharm-head"><span class="pharm-ic">${icon('cross')}</span>
      <div><div class="eyebrow">Pharmacy pickup</div><div class="pharm-status">${icon('check')}${esc(clean(p.pharmacyDemo.status))}</div></div></div>
    ${compact ? '' : `<p class="small">${esc(p.pharmacyDemo.description)}</p>`}
    <p class="tiny muted">Ask a pharmacist for medication questions.</p>
    <button class="btn ${on ? 'ghost' : 'outline'} full" data-action="toggle-pharmacy" aria-pressed="${on}">
      ${on ? `${icon('check')}Pickup stop added to route · Remove` : `${icon('pin')}Add pickup stop to my route`}</button>
  </section>`;
}

export function laptopComparison() {
  const p = persona();
  const ids = p?.comparisonIds || ['laptop-a', 'laptop-b'];
  const saved = state.savedComparisonIds.length > 0;
  const rows = Object.keys(LAPTOP_SPECS[ids[0]]);
  return `<section class="card compare">
    <div class="eyebrow">${icon('laptop')} Laptop comparison · under $900</div>
    <div class="compare-grid">
      <div></div>${ids.map((id) => `<div class="compare-col"><div class="pi lg">${productIcon(id)}</div><button class="link-name" data-action="open-product" data-id="${id}"><b>${esc(PRODUCTS[id].short)}</b></button><span class="price-tag">${money(PRODUCTS[id].demoPriceUsd)}</span></div>`).join('')}
      ${rows.map((r) => `<div class="compare-k">${r}</div>${ids.map((id) => `<div class="compare-v">${esc(LAPTOP_SPECS[id][r])}</div>`).join('')}`).join('')}
    </div>
    <p class="tiny muted">*Battery life varies with use. Not added to your grocery budget.</p>
    <button class="btn ${saved ? 'ghost' : 'outline'} full" data-action="${saved ? 'unsave-comparison' : 'save-comparison'}" aria-pressed="${saved}">
      ${saved ? `${icon('check')}Saved · “Compare in store” stop added · Remove` : `${icon('pin')}Save comparison · add Electronics stop`}</button>
  </section>`;
}

export function personalizationToggle() {
  const on = state.personalizationEnabled;
  return `<div class="privacy">
    <label class="switch"><input type="checkbox" data-action="toggle-personalization" ${on ? 'checked' : ''}><span class="track"><span class="thumb"></span></span>
      <span><b>Personalization ${on ? 'on' : 'off'}</b><br><span class="tiny muted">${on ? 'Compass may use your purchase history to explain suggestions.' : 'Prior purchases will not inform suggestions.'}</span></span></label>
    <button class="link-btn" data-action="show-data-use">${icon('eye')}See what Compass uses</button>
  </div>`;
}

export function dataUseModal() {
  const p = persona();
  const on = state.personalizationEnabled;
  return `<div class="overlay" data-action="close-modal"></div>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="mtitle">
    <div class="sheet-head"><h3 id="mtitle">What Compass uses</h3><button class="icon-btn" data-action="close-modal" aria-label="Close">${icon('x')}</button></div>
    <ul class="uses">
      <li class="yes">${icon('check')}Profile: ${esc(p.displayName)}, ${esc(p.subtitle)}</li>
      <li class="yes">${icon('check')}Your stated mission and preferences: ${p.preferences.map(esc).join(', ')}</li>
      <li class="${on ? 'yes' : 'no'}">${icon(on ? 'check' : 'x')}Purchase history ${on ? '(on)' : '(off — not used)'}</li>
      <li class="yes">${icon('check')}What you type or tap here (kept only in this browser tab)</li>
      <li class="no">${icon('x')}No real Costco account, location, payment, or health data</li>
      <li class="no">${icon('x')}No analytics or tracking of what you type</li>
    </ul>
  </div>`;
}

export const listBadge = () => {
  const n = itemCount();
  return n ? `<span class="badge">${n}</span>` : '';
};

export { reasonFor, suggestionReason, avatar as personaAvatar, PERSONAS };
