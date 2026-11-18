import { DATA } from './data.js';
import { DISCOVERY, INTENT_ITEMS, REASONS, PRODUCT_WORDS, EXTRA_CHIPS } from './content.js';
import { CATALOG, AISLES } from './inventory.js';

/** Referential-integrity contract from spec §16. Returns a list of problems (empty = OK). */
export function validateFixtures() {
  const errs = [];
  const W = DATA.warehouse;
  const prod = new Set(DATA.products.map((p) => p.id));
  const dept = new Set(W.departments.map((d) => d.id));
  const node = new Map(W.nodes.map((n) => [n.id, n]));
  DATA.products.forEach((p) => dept.has(p.departmentId) || errs.push(`product ${p.id}: unknown department ${p.departmentId}`));
  W.departments.forEach((d) => node.has(d.approachNodeId) || errs.push(`department ${d.id}: unknown node ${d.approachNodeId}`));
  W.nodes.forEach((n) => n.neighbors.forEach((m) => {
    if (!node.has(m)) errs.push(`node ${n.id}: unknown neighbor ${m}`);
    else if (!node.get(m).neighbors.includes(n.id)) errs.push(`edge ${n.id}->${m} is not symmetric`);
  }));
  [W.entranceNodeId, W.checkoutNodeId, W.exitNodeId].forEach((id) => node.has(id) || errs.push(`missing node ${id}`));
  for (const p of Object.values(DATA.personas)) {
    const ids = [...p.recentPurchases.map((r) => r.productId), ...p.baseCart, ...p.suggestions.map((s) => s.productId), ...(p.comparisonIds || [])];
    ids.forEach((id) => prod.has(id) || errs.push(`persona ${p.id}: unknown product ${id}`));
    (DISCOVERY[p.id] || []).forEach((d) => dept.has(d.dept) || errs.push(`discovery ${p.id}: unknown dept ${d.dept}`));
    Object.keys(REASONS[p.id] || {}).forEach((id) => prod.has(id) || errs.push(`reason ${p.id}: unknown product ${id}`));
  }
  Object.values(INTENT_ITEMS).forEach((set) => Object.values(set).flat().forEach((id) => prod.has(id) || errs.push(`intent item: unknown product ${id}`)));
  // Mock inventory contract
  const seen = new Set(), slots = new Set();
  for (const p of CATALOG) {
    if (seen.has(p.id)) errs.push(`catalog: duplicate id ${p.id}`); seen.add(p.id);
    if (!dept.has(p.departmentId)) errs.push(`catalog ${p.id}: unknown dept ${p.departmentId}`);
    const k = `${p.departmentId}:${p.bay}:${p.level}`; if (slots.has(k)) errs.push(`catalog ${p.id}: shelf slot ${k} overfilled`); slots.add(k);
  }
  W.departments.forEach((d) => AISLES[d.id] || errs.push(`aisle info missing for ${d.id}`));
  PRODUCT_WORDS.forEach(([w, id]) => seen.has(id) || errs.push(`keyword ${w}: unknown product ${id}`));
  Object.keys(EXTRA_CHIPS).forEach((k) => DATA.personas[k] || errs.push(`chips: unknown persona ${k}`));
  return errs;
}
