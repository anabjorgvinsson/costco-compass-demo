// Interactive SVG warehouse map (spec §5, §19). Geometry comes straight from the fixture.
import { esc, icon, DEPT_COLORS, PRODUCTS } from '../ui.js?v=20261117202059';
import { DEPT_LINES, VERTICAL_DEPTS } from '../content.js?v=20261117202059';
import { NODES, ROUTE_DEPTS, WAREHOUSE, badgeAnchor } from '../route.js?v=20261117202059';
import { state } from '../state.js?v=20261117202059';

const shade = { grocery: '#B8641F', home: '#2E7D52', electronics: '#2D6CA8', service: '#B03A4C', seasonal: '#6B4FB3' };

/** Is a stop complete (all of its checklist entries found)? */
export function stopDone(stop) {
  const ids = [...stop.productIds];
  if (stop.research) ids.push('stop:electronics');
  if (stop.pickup) ids.push('stop:pharmacy');
  return ids.length > 0 && ids.every((id) => state.foundIds.includes(id));
}

export function mapSvg(route, stops) {
  const byDept = Object.fromEntries(stops.map((s) => [s.dept, s]));
  const onRoute = new Set(route.order);
  const disc = route.discovery && !state.discoverySkipped ? route.discovery : null;
  const discSkipped = route.discovery && state.discoverySkipped ? route.discovery : null;

  // corridors (each undirected edge once)
  const seen = new Set();
  let corridors = '';
  for (const n of WAREHOUSE.nodes) for (const m of n.neighbors) {
    const k = [n.id, m].sort().join('|');
    if (seen.has(k)) continue; seen.add(k);
    corridors += `<line x1="${n.x}" y1="${n.y}" x2="${NODES[m].x}" y2="${NODES[m].y}"/>`;
  }

  const depts = WAREHOUSE.departments.map((d) => {
    const r = d.rect, c = DEPT_COLORS[d.category];
    const active = onRoute.has(d.id) || d.id === 'checkout';
    const isDisc = disc && disc.dept === d.id;
    const lines = DEPT_LINES[d.id] || [d.label];
    const vertical = VERTICAL_DEPTS.has(d.id);
    const hasBadge = onRoute.has(d.id) || isDisc;
    const cx = r.x + r.w / 2, cy = vertical && hasBadge ? r.y + (r.h - 50) / 2 + 4 : r.y + r.h / 2;
    const fs = vertical ? (hasBadge ? 16 : 19) : d.id === 'office' ? 20 : 25;
    const text = vertical
      ? `<text x="${cx}" y="${cy}" transform="rotate(-90 ${cx} ${cy})" font-size="${fs}" dy="7">${esc(lines[0])}</text>`
      : `<text x="${cx}" y="${cy - (lines.length - 1) * fs * 0.55}" font-size="${fs}">${lines.map((l, i) => `<tspan x="${cx}" dy="${i ? fs * 1.1 : fs * 0.35}">${esc(l)}</tspan>`).join('')}</text>`;
    const count = byDept[d.id]?.productIds.length || 0;
    return `<g class="dept ${active ? 'on' : 'off'} ${isDisc ? 'disc' : ''}" data-action="open-dept" data-dept="${d.id}" role="button" tabindex="0"
        aria-label="${esc(d.label)}${onRoute.has(d.id) ? `, stop ${route.order.indexOf(d.id) + 1}, ${count} item${count === 1 ? '' : 's'}` : ''}">
      <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="10" fill="${c}" stroke="${isDisc ? '#7C3AED' : shade[d.category]}"/>
      <g class="dept-label" fill="${shade[d.category]}">${text}</g>
    </g>`;
  }).join('');

  const pts = route.points.map((p) => `${p.x},${p.y}`).join(' ');
  const spur = (r) => r.spur.map((id) => `${NODES[id].x},${NODES[id].y}`).join(' ');

  const badges = route.order.map((d, i) => {
    const a = badgeAnchor(d);
    const done = stopDone(byDept[d]);
    return `<g class="badge-pin ${done ? 'done' : ''}" data-action="open-dept" data-dept="${d}" role="button" tabindex="0" aria-label="Stop ${i + 1}: ${esc(ROUTE_DEPTS[d].label)}${done ? ', complete' : ''}">
      <circle cx="${a.x}" cy="${a.y}" r="25"/>
      ${done ? `<path d="M${a.x - 10} ${a.y + 1}l7 7 13-14" class="ck"/>` : `<text x="${a.x}" y="${a.y}" dy="9">${i + 1}</text>`}
    </g>`;
  }).join('');

  let discBadge = '';
  if (disc) {
    const a = badgeAnchor(disc.dept);
    discBadge = `<g class="badge-disc" data-action="open-dept" data-dept="${disc.dept}" role="button" tabindex="0" aria-label="Optional discovery stop: ${esc(ROUTE_DEPTS[disc.dept].label)}">
      <circle cx="${a.x}" cy="${a.y}" r="25"/><path transform="translate(${a.x - 12} ${a.y - 12})" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></g>`;
  }

  const ent = NODES[WAREHOUSE.entranceNodeId], chk = NODES[WAREHOUSE.checkoutNodeId];
  return `<svg class="wh-map" viewBox="0 0 ${WAREHOUSE.viewBox.width} ${WAREHOUSE.viewBox.height}" role="group" aria-label="Warehouse map with your route.">
    <rect x="14" y="10" width="1172" height="680" rx="22" class="floor"/>
    <text x="690" y="64" class="floor-title">${esc(WAREHOUSE.floorLabel.replace(/\s*Demo\s*/i, ' ').toUpperCase())}</text>
    <g class="corridors">${corridors}</g>
    ${depts}
    ${pts && route.order.length ? `<polyline class="route-case" points="${pts}"/><polyline class="route-line" points="${pts}"/><polyline class="route-flow" points="${pts}"/>` : ''}
    ${disc ? `<polyline class="spur" points="${spur(disc)}"/>` : ''}
    ${discSkipped ? `<polyline class="spur skipped" points="${spur(discSkipped)}"/>` : ''}
    <g class="pin-start"><circle cx="${ent.x}" cy="${ent.y}" r="17"/><path d="M${ent.x - 6} ${ent.y + 6}l12-12M${ent.x - 2} ${ent.y - 6}h8v8"/></g>
    <g class="pin-check"><rect x="${chk.x - 17}" y="${chk.y - 17}" width="34" height="34" rx="9"/><path d="M${chk.x - 7} ${chk.y}l5 5 9-10"/></g>
    <g class="entry-label"><rect x="968" y="648" width="208" height="34" rx="17"/><text x="1072" y="671">ENTRANCE / EXIT ⇄</text></g>
    ${badges}${discBadge}
  </svg>`;
}

export function legend() {
  const items = [['grocery', 'Food & grocery'], ['home', 'Home goods'], ['electronics', 'Electronics'], ['service', 'Services'], ['seasonal', 'Seasonal']];
  return `<div class="legend">${items.map(([k, l]) => `<span><i style="background:${DEPT_COLORS[k]}"></i>${l}</span>`).join('')}
    <span><i class="lg-route"></i>Your route</span><span><i class="lg-spur"></i>Optional stop</span></div>`;
}

export { PRODUCTS, icon };
