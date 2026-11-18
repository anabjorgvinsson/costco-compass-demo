// Router + event wiring. Hash routes work on any static host (GitHub Pages) with no server rewrites:
//   #/                       persona picker (QR landing)
//   #/member/:persona        desktop personalized homepage
//   #/compass/:persona[/:view]  mobile Compass (home|chat|list|map|summary)
//   ?persona=sarah           deep link → #/compass/sarah
import { PERSONAS, PRODUCTS } from './ui.js?v=20261117202059';
import { state, save, resetTo, persona, addToCart, removeFromCart, changeQty, saveComparison, unsaveComparison, subtotal } from './state.js?v=20261117202059';
import { CompassAssistant } from './chat.js?v=20261117202059';
import { validateFixtures } from './validate.js?v=20261117202059';
import { landingView, welcomeView } from './views/landing.js?v=20261117202059';
import { memberView } from './views/member.js?v=20261117202059';
import { compassView, VIEWS } from './views/compass.js?v=20261117202059';
import { dataUseModal } from './views/common.js?v=20261117202059';
import { productModal } from './views/product.js?v=20261117202059';

const app = document.getElementById('app');
const ZOOMS = [1, 1.6, 2.4];

// ---------- integrity check at startup (spec §16) ----------
const problems = validateFixtures();
if (problems.length) {
  console.error('[Compass] Fixture integrity problems:', problems);
  if (/localhost|127\.0\.0\.1/.test(location.hostname)) document.body.insertAdjacentHTML('afterbegin', `<pre class="dev-err">Fixture errors:\n${problems.join('\n')}</pre>`);
} else console.info('[Compass] Fixture integrity OK');

// ---------- deep links ----------
(function deepLink() {
  const q = new URLSearchParams(location.search).get('persona');
  if (q && PERSONAS[q.toLowerCase()]) {
    history.replaceState(null, '', location.pathname + `#/compass/${q.toLowerCase()}`);
  }
})();

function parse() {
  const parts = location.hash.replace(/^#\/?/, '').split(/[/?]/).filter(Boolean);
  const [name, pid, view] = parts;
  if ((name === 'member' || name === 'compass') && PERSONAS[pid]) {
    return { name, persona: pid, view: name === 'compass' && VIEWS.includes(view) ? view : 'home' };
  }
  if (name === 'login') return { name: 'login', via: pid === 'via=shop' ? 'shop' : '' };
  return { name: 'landing' };
}

const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };
const goView = (view) => go(`#/compass/${state.personaId}${view === 'home' ? '' : '/' + view}`);

// ---------- render ----------
let lastKey = '', lastMsgCount = 0, focusScroll = false;
function render() {
  const r = parse();
  if ((r.name === 'member' || r.name === 'compass') && state.personaId !== r.persona) resetTo(r.persona); // clean persona switch
  const key = `${r.name}/${r.persona || r.via || ''}/${r.view || ''}`;
  const navChanged = key !== lastKey;
  if (navChanged) { state.ui.sheetDept = null; state.ui.modal = null; }

  const active = document.activeElement;
  const focusId = active && active.id && active.tagName === 'INPUT' ? active.id : null;
  const ms = document.getElementById('map-scroll');
  const mapPos = ms ? [ms.scrollLeft, ms.scrollTop] : null;
  const rk = document.getElementById('rack-scroll'); const rackPos = rk ? rk.scrollLeft : null;
  const sh = document.querySelector('.sheet, .modal'); const sheetPos = sh ? sh.scrollTop : null;
  const y = window.scrollY;

  const prevOverlay = app.querySelector('.sheet, .modal') ? `${state.ui.sheetDept}|${state.ui.modal}` : null;
  app.innerHTML = r.name === 'landing' ? welcomeView() : r.name === 'login' ? landingView(r.via) : r.name === 'member' ? memberView() + (state.ui.modal === 'data' ? dataUseModal() : '') + (state.ui.modal === 'product' && state.ui.product ? productModal(state.ui.product) : '') : compassView(r.view);
  if (prevOverlay === `${state.ui.sheetDept}|${state.ui.modal}`) app.querySelectorAll('.sheet, .modal, .overlay').forEach((el) => { el.style.animation = 'none'; });
  document.body.classList.toggle('sheet-open', !!(state.ui.sheetDept || state.ui.modal));
  document.title = r.name === 'landing' ? 'Costco Compass' : r.name === 'login' ? 'Log in · Costco Compass'
    : `${PERSONAS[r.persona].displayName} · Costco Compass${r.name === 'member' ? ' Home' : ''}`;

  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }
  const ms2 = document.getElementById('map-scroll');
  if (ms2 && mapPos && !navChanged) { ms2.scrollLeft = mapPos[0]; ms2.scrollTop = mapPos[1]; }
  const rk2 = document.getElementById('rack-scroll'); if (rk2 && rackPos != null) rk2.scrollLeft = rackPos;
  const sh2 = document.querySelector('.sheet, .modal'); if (sh2 && sheetPos != null && prevOverlay === `${state.ui.sheetDept}|${state.ui.modal}`) sh2.scrollTop = sheetPos;

  const msgCount = state.chatHistory.length + (state.pending ? 1 : 0);
  if (r.view === 'chat' && (navChanged || msgCount !== lastMsgCount)) {
    const last = state.pending ? null : [...app.querySelectorAll('.msg.compass')].pop();
    if (last && state.chatHistory.length && !navChanged) last.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, document.body.scrollHeight);
  } else window.scrollTo(0, navChanged ? 0 : y);
  if (state.ui.sheetDept && !focusId) document.querySelector('.sheet .icon-btn')?.focus({ preventScroll: true });
  if (focusScroll) {
    focusScroll = false;
    const slot = document.querySelector('.slot.focus');
    const rack = document.getElementById('rack-scroll');
    if (slot && rack) rack.scrollLeft = slot.offsetLeft - rack.clientWidth / 2 + slot.offsetWidth / 2;
    const pd = document.querySelector('.sheet .pd');
    if (pd) setTimeout(() => pd.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 60);
  }

  lastKey = key; lastMsgCount = msgCount;
  save();
}
const commit = () => render();

// ---------- toast ----------
let toastTimer;
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

// ---------- chat ----------
function sendPrompt(raw) {
  const text = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 500);
  if (!text) { toast('Type a request or tap a suggestion.'); return; }
  if (state.pending) return;
  const pid = state.personaId;
  state.chatHistory.push({ role: 'member', text, timestamp: Date.now() });
  state.draft = ''; state.pending = true;
  if (parse().view !== 'chat' || parse().name !== 'compass') goView('chat'); else commit();
  setTimeout(() => {
    if (state.personaId !== pid) return; // persona switched mid-reply
    let res;
    try {
      res = CompassAssistant.generatePlan({ personaId: pid, prompt: text, personalizationEnabled: state.personalizationEnabled,
        cartIds: state.cart.map((l) => l.productId), subtotal: subtotal(), budget: state.budget });
    } catch (e) {
      console.error(e);
      res = { kind: 'fallback', paragraphs: ['Something went wrong on my side. Try one of these suggestions.'], items: [], suggestions: [], remove: [], notes: [], chips: true };
    }
    res.items.forEach((it) => addToCart(it.id, 'base', it.why));
    res.remove.forEach((id) => removeFromCart(id));
    if (res.budget) state.budget = res.budget;
    state.chatHistory.push({ role: 'compass', text: res.paragraphs.join(' '), response: res, timestamp: Date.now() });
    state.pending = false;
    commit();
  }, 650);
}

// ---------- actions ----------
const actions = {
  'pick-persona': () => false, // let the link navigate; router resets state for the new persona
  'switch-member': () => { resetTo(null); go('#/login'); },
  restart: () => { resetTo(null); go('#/'); toast('Demo restarted'); },
  nav: (el) => goView(el.dataset.view),
  'send-prompt': (el) => sendPrompt(el.dataset.prompt),
  'add-item': (el) => { addToCart(el.dataset.id, el.dataset.source || 'manual'); toast(`Added ${PRODUCTS[el.dataset.id].name}`); },
  'remove-item': (el) => { removeFromCart(el.dataset.id); toast('Removed from list'); },
  'qty-inc': (el) => changeQty(el.dataset.id, 1),
  'qty-dec': (el) => changeQty(el.dataset.id, -1),
  'add-suggestion': (el) => {
    const id = el.dataset.id;
    if (PRODUCTS[id].kind === 'electronics') { saveComparison(); toast('Comparison saved · Electronics stop added'); return; }
    const s = persona().suggestions.find((x) => x.productId === id);
    addToCart(id, 'suggested', s?.why); toast(`Added ${PRODUCTS[id].name}`);
  },
  'dismiss-suggestion': (el) => { state.dismissedSuggestionIds.push(el.dataset.id); },
  'save-comparison': () => { saveComparison(); toast('Electronics “Compare in store” stop added'); },
  'unsave-comparison': () => unsaveComparison(),
  'toggle-pharmacy': () => {
    state.pharmacyStopSelected = !state.pharmacyStopSelected;
    if (!state.pharmacyStopSelected) state.foundIds = state.foundIds.filter((x) => x !== 'stop:pharmacy');
    toast(state.pharmacyStopSelected ? 'Pharmacy pickup stop added' : 'Pickup stop removed');
  },
  'toggle-why': (el) => { state.ui.whyOpen[el.dataset.id] = !state.ui.whyOpen[el.dataset.id]; },
  'set-mode': (el) => { state.routeMode = el.dataset.mode; state.discoverySkipped = false; },
  'toggle-discovery': () => { state.discoverySkipped = !state.discoverySkipped; },
  'open-dept': (el) => {
    if (parse().name !== 'compass') return;
    state.ui.modal = null; state.ui.sheetDept = el.dataset.dept; state.ui.sheetFocus = el.dataset.focus || null; state.ui.sheetTab = 'aisle'; focusScroll = true;
  },
  'focus-item': (el) => { state.ui.sheetFocus = state.ui.sheetFocus === el.dataset.id ? null : el.dataset.id; focusScroll = !!state.ui.sheetFocus; },
  'sheet-tab': (el) => { state.ui.sheetTab = el.dataset.tab; },
  'open-product': (el) => { state.ui.product = el.dataset.id; state.ui.modal = 'product'; },
  'toggle-found-btn': (el) => { const id = el.dataset.id; state.foundIds = state.foundIds.includes(id) ? state.foundIds.filter((x) => x !== id) : [...state.foundIds, id]; },
  'close-sheet': () => { state.ui.sheetDept = null; state.ui.sheetFocus = null; },
  'show-data-use': () => { state.ui.modal = 'data'; },
  'close-modal': () => { state.ui.modal = null; },
  'budget-inc': () => { state.budget = Math.min(500, state.budget + 10); },
  'budget-dec': () => { state.budget = Math.max(20, state.budget - 10); },
  'load-saved': () => { persona().baseCart.forEach((id) => addToCart(id, 'base')); toast('Saved trip list loaded'); },
  zoom: (el) => {
    const i = ZOOMS.indexOf(state.ui.mapZoom);
    state.ui.mapZoom = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, i + (el.dataset.z === 'in' ? 1 : -1)))];
  },
  'toggle-steps': () => { state.ui.stepsOpen = !state.ui.stepsOpen; },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.tagName === 'INPUT') return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  if (fn(el) === false) return; // default navigation
  e.preventDefault();
  if (el.dataset.action !== 'nav' && el.dataset.action !== 'switch-member' && el.dataset.action !== 'restart' && el.dataset.action !== 'send-prompt') commit();
});

document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.action === 'toggle-found') {
    const id = el.dataset.id;
    state.foundIds = el.checked ? [...new Set([...state.foundIds, id])] : state.foundIds.filter((x) => x !== id);
    commit();
  } else if (el.dataset.action === 'toggle-personalization') {
    state.personalizationEnabled = el.checked;
    toast(el.checked ? 'Personalization on' : 'Personalization off — history not used');
    commit();
  }
});

document.addEventListener('input', (e) => {
  if (e.target.closest('[data-form="chat"]')) state.draft = e.target.value;
  if (e.target.id === 'inv-q') { state.ui.invQuery = e.target.value; render(); }
});

document.addEventListener('submit', (e) => {
  const f = e.target.closest('form[data-form]');
  if (!f) return;
  e.preventDefault();
  sendPrompt(f.querySelector('input[name="q"]').value);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && (state.ui.sheetDept || state.ui.modal)) { state.ui.sheetDept = null; state.ui.modal = null; commit(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('g[role="button"]')) { e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
});

window.addEventListener('hashchange', render);
render();
