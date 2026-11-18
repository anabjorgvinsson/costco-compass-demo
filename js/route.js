// Corridor-graph routing. Routes only follow listed adjacent corridor edges (never through departments).
import { DATA } from './data.js';
import { DISCOVERY } from './content.js';

const W = DATA.warehouse;
const NODES = Object.fromEntries(W.nodes.map((n) => [n.id, n]));
const DEPTS = Object.fromEntries(W.departments.map((d) => [d.id, d]));
const IDS = W.nodes.map((n) => n.id);
const len = (a, b) => Math.hypot(NODES[a].x - NODES[b].x, NODES[a].y - NODES[b].y);

// All-pairs shortest paths (Floyd–Warshall) over 24 nodes, with next-hop reconstruction.
const DIST = {}, NEXT = {};
for (const a of IDS) {
  DIST[a] = {}; NEXT[a] = {};
  for (const b of IDS) { DIST[a][b] = a === b ? 0 : Infinity; NEXT[a][b] = a === b ? b : null; }
  for (const b of NODES[a].neighbors) { DIST[a][b] = len(a, b); NEXT[a][b] = b; }
}
for (const k of IDS) for (const i of IDS) for (const j of IDS) {
  const d = DIST[i][k] + DIST[k][j];
  if (d < DIST[i][j] - 1e-9) { DIST[i][j] = d; NEXT[i][j] = NEXT[i][k]; }
}

export function pathBetween(a, b) {
  if (NEXT[a][b] == null) return [a];
  const out = [a];
  while (a !== b) { a = NEXT[a][b]; out.push(a); }
  return out;
}

/** Held–Karp ordering: entrance → every stop once → checkout, minimizing corridor distance. */
export function orderStops(deptIds) {
  const start = W.entranceNodeId, end = W.checkoutNodeId;
  const k = deptIds.length;
  if (k <= 1) return deptIds.slice();
  const nd = deptIds.map((d) => DEPTS[d].approachNodeId);
  const FULL = 1 << k;
  const dp = Array.from({ length: FULL }, () => new Array(k).fill(Infinity));
  const par = Array.from({ length: FULL }, () => new Array(k).fill(-1));
  for (let j = 0; j < k; j++) dp[1 << j][j] = DIST[start][nd[j]];
  for (let m = 1; m < FULL; m++) for (let j = 0; j < k; j++) {
    if (!(m & (1 << j)) || dp[m][j] === Infinity) continue;
    for (let n = 0; n < k; n++) {
      if (m & (1 << n)) continue;
      const nm = m | (1 << n), v = dp[m][j] + DIST[nd[j]][nd[n]];
      if (v < dp[nm][n]) { dp[nm][n] = v; par[nm][n] = j; }
    }
  }
  let best = Infinity, last = 0;
  for (let j = 0; j < k; j++) { const v = dp[FULL - 1][j] + DIST[nd[j]][end]; if (v < best) { best = v; last = j; } }
  const order = []; let m = FULL - 1, j = last;
  while (j !== -1) { order.unshift(deptIds[j]); const pj = par[m][j]; m ^= 1 << j; j = pj; }
  return order;
}

/**
 * Build the walking route.
 * @param {{dept:string,type:string}[]} stops required stops (deduped departments)
 * @param {string|null} personaId used for Treasure Hunt discovery
 * @param {boolean} treasure include an optional discovery spur
 */
export function buildRoute(stops, personaId, treasure) {
  const order = orderStops(stops.map((s) => s.dept));
  const nodePath = [W.entranceNodeId];
  const stopPathIndex = [];
  let cur = W.entranceNodeId;
  for (const d of order) {
    const p = pathBetween(cur, DEPTS[d].approachNodeId);
    nodePath.push(...p.slice(1));
    stopPathIndex.push(nodePath.length - 1);
    cur = DEPTS[d].approachNodeId;
  }
  nodePath.push(...pathBetween(cur, W.checkoutNodeId).slice(1));

  let discovery = null;
  if (treasure && personaId) {
    const taken = new Set(order);
    const pick = (DISCOVERY[personaId] || []).find((d) => !taken.has(d.dept));
    if (pick) {
      const target = DEPTS[pick.dept].approachNodeId;
      let bestI = 0, bestD = Infinity;
      nodePath.forEach((n, i) => { if (DIST[n][target] < bestD) { bestD = DIST[n][target]; bestI = i; } });
      const afterStop = stopPathIndex.filter((pi) => pi <= bestI).length; // number of stops before the spur
      discovery = { ...pick, spur: pathBetween(nodePath[bestI], target), afterStop };
    }
  }
  return {
    order,
    nodePath,
    points: nodePath.map((id) => NODES[id]),
    discovery,
    distance: nodePath.slice(1).reduce((s, id, i) => s + len(nodePath[i], id), 0),
  };
}

/** Badge anchor: corner of the department rect nearest its approach node, inset. */
export function badgeAnchor(deptId, inset = 30) {
  const d = DEPTS[deptId], n = NODES[d.approachNodeId], r = d.rect;
  const x = n.x <= r.x ? r.x + inset : n.x >= r.x + r.w ? r.x + r.w - inset : r.x + r.w / 2;
  const y = n.y <= r.y ? r.y + inset : n.y >= r.y + r.h ? r.y + r.h - inset : r.y + r.h / 2;
  return { x, y };
}

export { NODES, DEPTS as ROUTE_DEPTS, W as WAREHOUSE };
