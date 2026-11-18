// Client-side demo state (spec §17). Session persistence only remembers the active persona's demo edits.
import { PERSONAS, PRODUCTS, clean } from './ui.js?v=20261117202059';
import { REASONS } from './content.js?v=20261117202059';

const KEY = 'costco-compass-demo-v1';

export function freshState(personaId = null) {
  return {
    personaId,
    personalizationEnabled: true,
    chatHistory: [],
    draft: '',
    pending: false,
    cart: [], // { productId, quantity, source: 'base'|'suggested'|'manual', why }
    dismissedSuggestionIds: [],
    savedComparisonIds: [],
    pharmacyStopSelected: false,
    routeMode: 'quick',
    discoverySkipped: false,
    foundIds: [], // product ids, plus 'stop:pharmacy' / 'stop:electronics'
    budget: personaId ? PERSONAS[personaId].budgetUsd : 0,
    ui: { sheetDept: null, sheetFocus: null, sheetTab: 'aisle', product: null, invQuery: '', modal: null, whyOpen: {}, mapZoom: 1, stepsOpen: false, homeDismissed: [] },
  };
}

export let state = load() || freshState();

function load() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (s && (s.personaId === null || PERSONAS[s.personaId])) {
      return { ...freshState(s.personaId), ...s, pending: false, ui: { ...freshState().ui, ...(s.ui || {}), sheetDept: null, modal: null } };
    }
  } catch (_) { /* storage unavailable — fine */ }
  return null;
}
export function save() {
  try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* ignore */ }
}
export function resetTo(personaId) { state = freshState(personaId); save(); }

export const persona = () => (state.personaId ? PERSONAS[state.personaId] : null);

/** Reason shown for a product for the active persona; history only if personalization is on. */
export function reasonFor(productId, fallback) {
  const p = persona();
  if (!p) return fallback || '';
  const base = REASONS[p.id]?.[productId] || fallback || 'Fits your trip mission';
  if (state.personalizationEnabled) {
    const hist = p.recentPurchases.find((r) => r.productId === productId);
    if (hist) return `You bought this ${hist.when} · ${base}`;
  }
  return base;
}

export function suggestionReason(productId) {
  const p = persona();
  const s = p?.suggestions.find((x) => x.productId === productId);
  const historyBased = s && /bought|recent/i.test(s.why);
  if (s && (!historyBased || state.personalizationEnabled)) return clean(s.why);
  return reasonFor(productId);
}

// ----- cart mutations -----
export const cartLine = (id) => state.cart.find((l) => l.productId === id);
export function addToCart(productId, source = 'manual', why) {
  const p = PRODUCTS[productId];
  if (!p) return;
  if (p.kind === 'electronics') { saveComparison(); return; }
  const line = cartLine(productId);
  if (line) return;
  state.cart.push({ productId, quantity: 1, source, why: why || null });
  state.dismissedSuggestionIds = state.dismissedSuggestionIds.filter((x) => x !== productId);
}
export function removeFromCart(productId) {
  state.cart = state.cart.filter((l) => l.productId !== productId);
  state.foundIds = state.foundIds.filter((x) => x !== productId);
}
export function changeQty(productId, delta) {
  const line = cartLine(productId);
  if (!line) return;
  line.quantity = Math.max(0, Math.min(20, line.quantity + delta));
  if (line.quantity === 0) removeFromCart(productId);
}
export function saveComparison() {
  const ids = persona()?.comparisonIds || ['laptop-a', 'laptop-b'];
  state.savedComparisonIds = ids.slice();
}
export function unsaveComparison() {
  state.savedComparisonIds = [];
  state.foundIds = state.foundIds.filter((x) => x !== 'stop:electronics');
}

export const subtotal = () => state.cart.reduce((s, l) => s + PRODUCTS[l.productId].demoPriceUsd * l.quantity, 0);
export const itemCount = () => state.cart.reduce((s, l) => s + l.quantity, 0);

/** Suggestions still open for this persona (not in cart, not dismissed). */
export function openSuggestions() {
  const p = persona();
  if (!p) return [];
  return p.suggestions
    .filter((s) => !cartLine(s.productId) && !state.dismissedSuggestionIds.includes(s.productId))
    .filter((s) => !(PRODUCTS[s.productId].kind === 'electronics' && state.savedComparisonIds.length));
}

/** Required route stops derived from cart + explicit comparison/pickup decisions (deduped). */
export function requiredStops() {
  const map = new Map();
  for (const l of state.cart) {
    const d = PRODUCTS[l.productId].departmentId;
    if (!map.has(d)) map.set(d, { dept: d, type: 'shop', productIds: [] });
    map.get(d).productIds.push(l.productId);
  }
  if (state.savedComparisonIds.length) {
    const s = map.get('electronics') || { dept: 'electronics', type: 'research', productIds: [] };
    s.research = true; map.set('electronics', s);
  }
  if (state.personaId === 'sarah' && state.pharmacyStopSelected) {
    const s = map.get('pharmacy') || { dept: 'pharmacy', type: 'pickup', productIds: [] };
    s.pickup = true; map.set('pharmacy', s);
  }
  return [...map.values()];
}

/** Checklist entries: every cart line, plus research/pickup tasks. */
export function checklist() {
  const list = state.cart.map((l) => l.productId);
  if (state.savedComparisonIds.length) list.push('stop:electronics');
  if (state.personaId === 'sarah' && state.pharmacyStopSelected) list.push('stop:pharmacy');
  return list;
}
export const foundCount = () => checklist().filter((id) => state.foundIds.includes(id)).length;
