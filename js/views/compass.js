// Surface B — mobile-first Compass app: home / chat / list / map / summary.
import { clean, esc, icon, logo, money, productIcon, PRODUCTS, DEPTS, unitPriceText, PERSONAS } from '../ui.js';
import { state, persona, cartLine, subtotal, itemCount, openSuggestions, suggestionReason, reasonFor, requiredStops, checklist, foundCount } from '../state.js';
import { buildRoute } from '../route.js';
import { avatar, membershipPill, personalizationToggle, pharmacyCard, laptopComparison, productRow, deptChip, disclaimerBar, listBadge, dataUseModal } from './common.js';
import { mapSvg, legend, stopDone } from './map.js';
import { productDetail, productModal, aisleScene, inventoryList, deptStats, searchInventory, stockPill, nutritionLabel, AISLES } from './product.js';
import { locationOf } from '../inventory.js';
import { goalSummary } from '../details.js';
import { EXTRA_CHIPS } from '../content.js';

const VIEWS = ['home', 'chat', 'list', 'map', 'summary'];

export function compassView(view) {
  const p = persona();
  const body = { home: homeView, chat: chatView, list: listView, map: mapView, summary: summaryView }[view] || homeView;
  return `<div class="app ${view === 'map' ? 'wide' : ''} view-${view}">
    <header class="app-head">
      <div class="app-head-row">
        ${view === 'home' ? `<a href="#/" class="logo-link" aria-label="Member picker">${logo('light')}</a><span class="concept-tag">Student concept</span>`
          : `<button class="back" data-action="nav" data-view="${backOf(view)}" aria-label="Back">${icon('left')}</button><span class="head-title">${titleOf(view)}</span>`}
        <button class="who" data-action="switch-member" aria-label="Switch member (currently ${esc(p.displayName)})">${avatar(p, 'sm')}<span>${esc(p.displayName)}</span><small>Switch</small></button>
      </div>
    </header>
    ${disclaimerBar()}
    <main class="app-main" id="main">${body(p)}</main>
    ${bottomNav(view)}
    ${state.ui.sheetDept ? deptSheet(state.ui.sheetDept) : ''}
    ${state.ui.modal === 'data' ? dataUseModal() : ''}
    ${state.ui.modal === 'product' && state.ui.product ? productModal(state.ui.product) : ''}
  </div>`;
}

const backOf = (v) => ({ chat: 'home', list: 'chat', map: 'list', summary: 'map' }[v] || 'home');
const titleOf = (v) => ({ chat: 'Ask Compass', list: 'Your shopping list', map: 'Your warehouse route', summary: 'Trip summary' }[v] || '');

function bottomNav(view) {
  const tabs = [['home', 'home', 'Home'], ['chat', 'compass', 'Compass'], ['list', 'list', 'List'], ['map', 'map', 'Map']];
  return `<nav class="tabbar" aria-label="Compass sections">${tabs.map(([v, ic, l]) =>
    `<button data-action="nav" data-view="${v}" class="${view === v || (view === 'summary' && v === 'map') ? 'active' : ''}" aria-current="${view === v ? 'page' : 'false'}">
      <span class="tab-ic">${icon(ic)}${v === 'list' ? listBadge() : ''}</span>${l}</button>`).join('')}</nav>`;
}

// ---------------- HOME ----------------
function homeView(p) {
  const pz = state.personalizationEnabled;
  const buyAgain = p.recentPurchases.slice(0, 4);
  return `<section class="greet">
      ${avatar(p, 'lg')}
      <div><p class="eyebrow light">Welcome back</p><h1>Hello, ${esc(p.displayName)}!</h1>
      <div class="greet-meta">${membershipPill(p)}<span>${esc(p.subtitle)}</span></div></div>
    </section>
    <section class="card mission">
      <div class="eyebrow">${icon('flag')} Today's mission</div>
      <p>${esc(p.mission)}</p>
      <div class="mission-foot"><span class="tag gold">Target ${money(p.budgetUsd)}</span><span class="tiny muted">${esc(clean(p.homeWarehouse))}</span></div>
    </section>
    <section class="card ask">
      <h2>${icon('compass')} Ask Compass</h2>
      <form class="composer inline" data-form="chat">
        <input name="q" type="text" placeholder="e.g. ${esc(p.promptChips[0])}" aria-label="Ask Compass" autocomplete="off" maxlength="500" value="${esc(state.draft)}" id="home-q">
        <button class="send" type="submit" aria-label="Send">${icon('send')}</button>
      </form>
      <div class="chips">${p.promptChips.map((c) => `<button class="chip" data-action="send-prompt" data-prompt="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <button class="btn red full lg" data-action="send-prompt" data-prompt="${esc(p.defaultPrompt)}">${icon('sparkle')}Plan my trip with Compass</button>
    </section>
    ${p.id === 'sarah' ? pharmacyCard(true) : ''}
    <section>
      <div class="sec-head"><h2>Recently purchased</h2></div>
      ${pz ? '' : `<p class="note">${icon('shield')}Personalization is off — history won't inform suggestions.</p>`}
      <div class="hscroll">${p.recentPurchases.map((r) => {
        const pr = PRODUCTS[r.productId];
        return `<div class="mini-card"><div class="pi">${productIcon(pr.id)}</div><b>${esc(pr.name)}</b><span class="tiny muted">${esc(DEPTS[pr.departmentId].label)}</span><span class="tiny">${icon('receipt')}${esc(r.when)}</span></div>`;
      }).join('')}</div>
    </section>
    <section class="card">
      <div class="sec-head"><h2>Buy again</h2><span class="tiny muted">Adds to your trip list</span></div>
      ${buyAgain.map((r) => {
        const pr = PRODUCTS[r.productId]; const inCart = !!cartLine(pr.id);
        return `<div class="prow"><div class="pi">${productIcon(pr.id)}</div><div class="prow-main"><div class="prow-name">${esc(pr.name)}</div><div class="prow-meta"><b>${money(pr.demoPriceUsd)}</b> · ${esc(pr.unitLabel)}</div></div>
          <div class="prow-act">${inCart ? `<span class="added">${icon('check')}Added</span>` : `<button class="btn-chip" data-action="add-item" data-id="${pr.id}" data-source="manual">${icon('plus')}Add</button>`}</div></div>`;
      }).join('')}
    </section>
    <section class="card">${personalizationToggle()}</section>
    <p class="center tiny"><a href="#/member/${p.id}">View ${esc(p.displayName)}'s desktop homepage ${icon('right')}</a></p>`;
}

// ---------------- CHAT ----------------
function chatView(p) {
  const msgs = state.chatHistory.map(renderMsg).join('');
  const intro = `<div class="msg compass"><div class="bubble">Hi ${esc(p.displayName)} — I'm Compass. Tell me what you need, or tap a suggestion. I'll build an editable list and map your route.</div></div>`;
  return `<div class="chat" id="chat-log" aria-live="polite">
      ${intro}${msgs}
      ${state.pending ? `<div class="msg compass"><div class="bubble typing"><span></span><span></span><span></span> Planning your trip…</div></div>` : ''}
    </div>
    <div class="composer-dock">
      <div class="chips scroll">${[...p.promptChips, ...(EXTRA_CHIPS[p.id] || [])].map((c) => `<button class="chip" data-action="send-prompt" data-prompt="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <form class="composer" data-form="chat">
        <input name="q" type="text" placeholder="Ask Compass…" aria-label="Message Compass" autocomplete="off" maxlength="500" value="${esc(state.draft)}" id="chat-q">
        <button class="send" type="submit" aria-label="Send">${icon('send')}</button>
      </form>
    </div>`;
}

function renderMsg(m) {
  if (m.role === 'member') return `<div class="msg member"><div class="bubble">${esc(m.text)}</div></div>`;
  const r = m.response;
  const p = persona();
  const parts = [];
  parts.push(r.paragraphs.map((t) => `<p>${esc(t)}</p>`).join(''));
  if (r.items.length && r.ctas) parts.push(`<div class="quickbar"><span><b>${r.items.length} item${r.items.length === 1 ? '' : 's'} added</b> · ${money(subtotal())} est.</span><button class="btn-chip gold" data-action="nav" data-view="map">${icon('map')}Map my trip</button></div>`);
  if (r.meals) parts.push(`<ol class="meals">${r.meals.map((x) => `<li><b>${esc(x.name)}</b><span>${esc(x.uses)}</span></li>`).join('')}</ol>`);
  if (r.items.length) {
    parts.push(`<div class="resp-block"><div class="eyebrow">${icon('list')} Added to your list</div>${r.items.map((it) => productRow(it.id, { why: it.why || reasonFor(it.id), mode: 'plan' })).join('')}</div>`);
  }
  if (r.unitTable) {
    const ids = r.items.map((x) => x.id);
    parts.push(`<div class="resp-block"><div class="eyebrow">${icon('scale')} Unit value</div><table class="unit-table"><tbody>${ids.map((id) => `<tr><td>${esc(PRODUCTS[id].name)}</td><td>${esc(PRODUCTS[id].unitLabel)}</td><td><b>${unitPriceText(PRODUCTS[id]) || '—'}</b></td></tr>`).join('')}</tbody></table>
      <p class="tiny muted">Split six ways: ${money(ids.reduce((s, id) => s + PRODUCTS[id].demoPriceUsd, 0) / 6)} per roommate.</p></div>`);
  }
  const sugg = r.suggestions.filter((id) => PRODUCTS[id]);
  if (sugg.length) parts.push(`<div class="resp-block may"><div class="eyebrow gold-ink">${icon('sparkle')} You may also need</div>${sugg.map((id) => productRow(id, { why: suggestionReason(id), mode: 'suggest' })).join('')}</div>`);
  if (r.locate?.length) parts.push(`<div class="resp-block"><div class="eyebrow">${icon('pin')} In the warehouse</div>${r.locate.map((id) => {
    const pr = PRODUCTS[id]; const loc = locationOf(pr);
    return `<div class="prow"><div class="pi">${productIcon(id)}</div><div class="prow-main"><button class="prow-name link-name" data-action="open-product" data-id="${id}">${esc(pr.name)}</button>
      <div class="prow-meta">${stockPill(pr)} <b>${esc(loc.text)}</b></div></div>
      <div class="prow-act"><button class="btn-chip" data-action="open-dept" data-dept="${pr.departmentId}" data-focus="${id}">${icon('map')}View aisle</button></div></div>`;
  }).join('')}</div>`);
  if (r.nutrition?.length) parts.push(`<div class="resp-block nutri">${r.nutrition.map((id) => `<div class="nf-wrap"><button class="nf-name link-name" data-action="open-product" data-id="${id}">${productIcon(id)}${esc(PRODUCTS[id].short)}</button>${nutritionLabel(id)}</div>`).join('')}</div>`);
  if (r.goal) {
    const g = goalSummary(p.id, state.cart, PRODUCTS);
    if (g && state.cart.length) parts.push(`<div class="goal-card"><div class="eyebrow gold-ink">${icon('target')} ${esc(g.title)}</div>${g.rows.map(([k, v]) => `<div class="goal-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}<p class="tiny muted">${esc(g.note)}</p></div>`);
  }
  if (r.comparison) parts.push(laptopComparison());
  if (r.pharmacy && p.id === 'sarah') parts.push(pharmacyCard(true));
  if (r.items.length || r.kind === 'mission') parts.push(`<div class="subtotal"><span>Estimated total</span><b>${money(subtotal())}</b></div>`);
  if (r.notes?.length) parts.push(r.notes.map((n) => `<p class="tiny muted">${icon('info')}${esc(n)}</p>`).join(''));
  if (r.chips) parts.push(`<div class="chips">${p.promptChips.map((c) => `<button class="chip" data-action="send-prompt" data-prompt="${esc(c)}">${esc(c)}</button>`).join('')}</div>`);
  if (r.ctas) parts.push(`<div class="cta-row"><button class="btn outline" data-action="nav" data-view="list">${icon('list')}View my shopping list</button><button class="btn red" data-action="nav" data-view="map">${icon('map')}Map my trip</button></div>`);
  return `<div class="msg compass"><div class="bubble rich ${r.kind}">${parts.join('')}</div></div>`;
}

// ---------------- LIST ----------------
function listView(p) {
  const sub = subtotal(), budget = state.budget, diff = budget - sub;
  const sugg = openSuggestions();
  const lines = state.cart.map((l) => {
    const pr = PRODUCTS[l.productId];
    const open = state.ui.whyOpen[pr.id];
    const why = l.why || reasonFor(pr.id);
    return `<li class="line">
      <div class="pi">${productIcon(pr.id)}</div>
      <div class="line-main">
        <div class="line-name">${esc(pr.name)}</div>
        <div class="line-meta">${esc(pr.unitLabel)}${unitPriceText(pr) ? ` · ${unitPriceText(pr)}` : ''}</div>
        ${deptChip(pr.departmentId)}
        <button class="why-btn" data-action="toggle-why" data-id="${pr.id}" aria-expanded="${!!open}">${icon('sparkle')}Why this suggestion?</button>
        ${open ? `<p class="why-text">${esc(why)}</p>` : ''}
        <button class="why-btn blue" data-action="open-product" data-id="${pr.id}">${icon('nutrition')}Details, nutrition & aisle</button>
      </div>
      <div class="line-side">
        <b class="line-price">${money(pr.demoPriceUsd * l.quantity)}</b>
        <div class="qty" role="group" aria-label="Quantity for ${esc(pr.name)}">
          <button data-action="qty-dec" data-id="${pr.id}" aria-label="Decrease">${icon(l.quantity === 1 ? 'x' : 'minus')}</button>
          <span aria-live="polite">${l.quantity}</span>
          <button data-action="qty-inc" data-id="${pr.id}" aria-label="Increase">${icon('plus')}</button>
        </div>
        <button class="link-btn danger" data-action="remove-item" data-id="${pr.id}">Remove</button>
      </div>
    </li>`;
  }).join('');

  return `${state.cart.length ? `<ul class="lines">${lines}</ul>` : `<section class="card empty">
      <div class="empty-ic">${icon('cart')}</div><h2>Your list is empty</h2>
      <p class="muted">Ask Compass to build it, or load ${esc(p.displayName)}'s saved trip list.</p>
      <button class="btn red full" data-action="send-prompt" data-prompt="${esc(p.defaultPrompt)}">${icon('sparkle')}Plan my trip with Compass</button>
      <button class="btn outline full" data-action="load-saved">${icon('list')}Use my saved trip list</button></section>`}

    <section class="card totals">
      <div class="total-row big"><span>Estimated total</span><b>${money(sub)}</b></div>
      <div class="budget-row"><span>Target budget</span>
        <div class="qty"><button data-action="budget-dec" aria-label="Lower budget">${icon('minus')}</button><span>${money(budget)}</span><button data-action="budget-inc" aria-label="Raise budget">${icon('plus')}</button></div></div>
      <div class="meter"><span style="width:${Math.min(100, (sub / Math.max(budget, 1)) * 100)}%" class="${diff < 0 ? 'over' : ''}"></span></div>
      <p class="small ${diff < 0 ? 'warn' : 'ok'}">${diff >= 0 ? `${money(diff)} under your target` : `${money(-diff)} over your target`} · ${itemCount()} item${itemCount() === 1 ? '' : 's'}</p>
      ${p.id === 'maya' && state.cart.length ? `<p class="tiny muted">${icon('scale')}Split six ways: ${money(sub / 6)} per roommate.</p>` : ''}
      ${p.id === 'jake' && state.savedComparisonIds.length ? `<p class="tiny muted">${icon('laptop')}Laptop comparison saved — not counted in this grocery total.</p>` : ''}
    </section>

    ${sugg.length ? `<section class="card"><div class="eyebrow gold-ink">${icon('sparkle')} You may also need</div>${sugg.map((s) =>
      PRODUCTS[s.productId].kind === 'electronics'
        ? `<div class="prow"><div class="pi">${productIcon(s.productId)}</div><div class="prow-main"><div class="prow-name">Laptop comparison</div><div class="prow-why">${icon('sparkle')}${esc(clean(s.why))}</div></div><div class="prow-act"><button class="btn-chip gold" data-action="save-comparison">Compare</button><button class="icon-btn sm" data-action="dismiss-suggestion" data-id="${s.productId}" aria-label="Dismiss">${icon('x')}</button></div></div>`
        : productRow(s.productId, { why: suggestionReason(s.productId), mode: 'suggest' })).join('')}</section>` : ''}
    ${p.id === 'jake' && state.savedComparisonIds.length ? laptopComparison() : ''}
    ${p.id === 'sarah' ? pharmacyCard(true) : ''}

    <section class="card">
      <h2 class="h-sm">How do you want to shop?</h2>
      ${modePicker()}
      <button class="btn red full lg" data-action="nav" data-view="map" ${state.cart.length || state.savedComparisonIds.length || state.pharmacyStopSelected ? '' : 'disabled'}>${icon('map')}Map my trip</button>
    </section>`;
}

function modePicker() {
  const m = state.routeMode;
  return `<div class="modes" role="radiogroup" aria-label="Trip mode">
    <button role="radio" aria-checked="${m === 'quick'}" class="mode ${m === 'quick' ? 'sel' : ''}" data-action="set-mode" data-mode="quick">
      <span class="mode-ic">${icon('bolt')}</span><b>Quick Trip</b><span>Required stops only, most direct path</span></button>
    <button role="radio" aria-checked="${m === 'treasure'}" class="mode ${m === 'treasure' ? 'sel' : ''}" data-action="set-mode" data-mode="treasure">
      <span class="mode-ic gold">${icon('gem')}</span><b>Treasure Hunt</b><span>+1 optional discovery stop you can skip</span></button>
  </div>`;
}

// ---------------- MAP ----------------
export function currentRoute() {
  const stops = requiredStops();
  return { stops, route: buildRoute(stops, state.personaId, state.routeMode === 'treasure') };
}

function mapView(p) {
  const { stops, route } = currentRoute();
  const byDept = Object.fromEntries(stops.map((s) => [s.dept, s]));
  const total = checklist().length, found = foundCount();
  const disc = route.discovery;

  const steps = [];
  steps.push(`<li class="step fixed"><span class="sn start">${icon('door')}</span><div><b>Entrance</b><span class="tiny muted">Start here</span></div></li>`);
  route.order.forEach((d, i) => {
    if (disc && disc.afterStop === i) steps.push(discStep(disc));
    const s = byDept[d]; const done = stopDone(s);
    const n = s.productIds.length;
    const sub = [n ? `${n} item${n === 1 ? '' : 's'}` : '', s.research ? 'Compare in store' : '', s.pickup ? 'Pharmacy pickup' : ''].filter(Boolean).join(' · ');
    steps.push(`<li><button class="step ${done ? 'done' : ''}" data-action="open-dept" data-dept="${d}"><span class="sn">${done ? icon('check') : i + 1}</span>
      <div><b>${esc(DEPTS[d].label)}</b><span class="tiny muted">${sub}</span></div>${icon('right')}</button></li>`);
  });
  if (disc && disc.afterStop >= route.order.length) steps.push(discStep(disc));
  steps.push(`<li class="step fixed"><span class="sn end">${icon('check')}</span><div><b>Checkout → Exit</b><span class="tiny muted">${money(subtotal())} estimated · demo</span></div></li>`);
  const collapsed = !state.ui.stepsOpen && steps.length > 5;
  const shown = collapsed ? steps.slice(0, 4) : steps;

  if (!route.order.length) {
    return `<section class="card empty"><div class="empty-ic">${icon('map')}</div><h2>No stops yet</h2><p class="muted">Your route appears once your list has items.</p>
      <button class="btn red full" data-action="send-prompt" data-prompt="${esc(p.defaultPrompt)}">${icon('sparkle')}Plan my trip with Compass</button>
      <button class="btn outline full" data-action="load-saved">${icon('list')}Use my saved trip list</button></section>
      ${invSearch()}<div class="map-box">${mapSvg(route, stops)}</div>`;
  }

  return `${invSearch()}${modePicker()}
    ${state.routeMode === 'treasure' && disc ? `<div class="disc-banner ${state.discoverySkipped ? 'skipped' : ''}">${icon('gem')}<div><b>Optional discovery stop: ${esc(DEPTS[disc.dept].label)}</b><span>${esc(disc.blurb)}</span></div>
      <button class="btn-chip ${state.discoverySkipped ? 'gold' : ''}" data-action="toggle-discovery">${state.discoverySkipped ? 'Include' : 'Skip'}</button></div>` : ''}
    ${state.routeMode === 'quick' ? `<div class="mode-note">${icon('bolt')}<span><b>Quick Trip:</b> ${route.order.length} required stop${route.order.length === 1 ? '' : 's'}, no detours.</span></div>` : ''}
    <div class="map-box">
      <div class="map-scroll" id="map-scroll"><div class="map-inner" style="width:${state.ui.mapZoom * 100}%">${mapSvg(route, stops)}</div></div>
    </div>
    <div class="map-tools"><p class="map-note">${icon('info')}Tap any department to walk the aisle.</p>
      <div class="zoom"><button data-action="zoom" data-z="out" aria-label="Zoom out" ${state.ui.mapZoom <= 1 ? 'disabled' : ''}>${icon('zoomOut')}</button><button data-action="zoom" data-z="in" aria-label="Zoom in" ${state.ui.mapZoom >= 2.4 ? 'disabled' : ''}>${icon('zoomIn')}</button></div></div>
    ${legend()}
    <section class="card">
      <div class="progress-head"><b>${found} of ${total} found</b><span class="tiny muted">${esc(p.routeNarrative)}</span></div>
      <div class="meter gold"><span style="width:${total ? (found / total) * 100 : 0}%"></span></div>
      <ol class="steps">${shown.join('')}</ol>
      ${steps.length > 5 ? `<button class="link-btn" data-action="toggle-steps">${state.ui.stepsOpen ? 'Show less' : `Show my route (${steps.length} steps)`}</button>` : ''}
    </section>
    <button class="btn red full lg" data-action="nav" data-view="summary">${icon('check')}Finish trip</button>`;
}

function invSearch() {
  const q = state.ui.invQuery || '';
  const res = searchInventory(q);
  return `<div class="inv-search">${icon('search')}<input id="inv-q" type="search" placeholder="Search warehouse inventory" aria-label="Search warehouse inventory" autocomplete="off" maxlength="60" value="${esc(q)}"></div>
    ${q.trim().length >= 2 ? `<div class="card inv-results">${res.length ? res.map((pr) => `<button class="inv-row" data-action="open-dept" data-dept="${pr.departmentId}" data-focus="${pr.id}">
      <span class="pi sm">${productIcon(pr.id)}</span><span class="inv-main"><b>${esc(pr.short)}</b><span class="tiny muted">${esc(locationOf(pr).text)}</span></span>
      <span class="inv-side"><b>${money(pr.demoPriceUsd)}</b>${stockPill(pr)}</span></button>`).join('') : `<p class="muted small">No items match “${esc(q)}”.</p>`}
      </div>` : ''}`;
}

const discStep = (disc) => `<li><button class="step disc ${state.discoverySkipped ? 'skipped' : ''}" data-action="open-dept" data-dept="${disc.dept}"><span class="sn">${icon('star')}</span>
  <div><b>${state.discoverySkipped ? 'Skipped · ' : ''}Optional: ${esc(DEPTS[disc.dept].label)}</b><span class="tiny muted">${esc(disc.title)} · browse only</span></div>${icon('right')}</button></li>`;

// ---------------- DEPARTMENT SHEET ----------------
function deptSheet(deptId) {
  const d = DEPTS[deptId];
  const a = AISLES[deptId];
  const { stops, route } = currentRoute();
  const stop = stops.find((s) => s.dept === deptId);
  const idx = route.order.indexOf(deptId);
  const disc = route.discovery && route.discovery.dept === deptId ? route.discovery : null;
  const st = deptStats(deptId);
  const tab = state.ui.sheetTab || 'aisle';
  const check = (id, title, sub) => {
    const f = state.foundIds.includes(id);
    return `<label class="found ${f ? 'is' : ''}"><input type="checkbox" data-action="toggle-found" data-id="${id}" ${f ? 'checked' : ''}><span class="box">${icon('check')}</span>
      <span class="found-main"><b>${esc(title)}</b><span class="tiny muted">${esc(sub)}</span></span></label>`;
  };
  let mine = '';
  if (stop) {
    mine += stop.productIds.map((id) => { const pr = PRODUCTS[id]; const l = cartLine(id); return check(id, pr.short, `Qty ${l.quantity} · ${money(pr.demoPriceUsd * l.quantity)} · ${locationOf(pr).bay}, ${locationOf(pr).level}`); }).join('');
    if (stop.research) mine += check('stop:electronics', 'Compare in store: HP 14" vs Lenovo IdeaPad 5', 'Research stop · not in grocery total');
    if (stop.pickup) mine += check('stop:pharmacy', 'Pharmacy pickup', `${clean(persona().pharmacyDemo.status)}. Ask a pharmacist for medication questions.`);
  }
  const service = a.style === 'service';
  return `<div class="overlay" data-action="close-sheet"></div>
  <div class="sheet aisle-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
    <div class="grab"></div>
    <div class="sheet-head"><div class="sh-title">${idx >= 0 ? `<span class="sn sm">${idx + 1}</span>` : disc ? `<span class="sn sm disc">${icon('star')}</span>` : ''}
      <div><h3 id="sheet-title">${esc(d.label)}</h3><span class="tiny muted">${esc(a.aisle)} · ${esc(a.blurb)}</span></div></div>
      <button class="icon-btn" data-action="close-sheet" aria-label="Close">${icon('x')}</button></div>
    <div class="inv-meta">${st.n ? `<span class="tiny muted">${st.n} products · ${st.low} low · ${st.out} out</span>` : ''}</div>
    ${disc ? `<div class="disc-body">${icon('gem')}<p><b>Optional discovery stop · ${esc(disc.title)}</b><br>${esc(disc.blurb)}</p></div>
      <button class="btn outline full" data-action="toggle-discovery">${state.discoverySkipped ? 'Include this optional stop' : 'Skip this optional stop'}</button>` : ''}
    ${mine ? `<div class="mine"><div class="eyebrow">${icon('list')} On your list here</div>${mine}</div>` : ''}
    ${service ? `<ul class="uses">${a.services.map((x) => `<li class="yes">${icon('info')}${esc(x)}</li>`).join('')}</ul>
      ${deptId === 'checkout' ? `<p class="muted small">Estimated basket: <b>${money(subtotal())}</b></p>` : ''}
      ${st.n ? inventoryList(deptId) : ''}`
    : `<div class="seg" role="tablist"><button role="tab" aria-selected="${tab === 'aisle'}" class="${tab === 'aisle' ? 'on' : ''}" data-action="sheet-tab" data-tab="aisle">${icon('map')}Aisle view</button>
        <button role="tab" aria-selected="${tab === 'list'}" class="${tab === 'list' ? 'on' : ''}" data-action="sheet-tab" data-tab="list">${icon('list')}Inventory list</button></div>
      ${tab === 'aisle' ? aisleScene(deptId) : inventoryList(deptId)}
      ${state.ui.sheetFocus && PRODUCTS[state.ui.sheetFocus]?.departmentId === deptId ? productDetail(state.ui.sheetFocus, { compact: true }) : `<p class="tiny muted center">Tap any product for price, stock, nutrition and exact shelf location.</p>`}`}
  </div>`;
}

// ---------------- SUMMARY ----------------
function summaryView(p) {
  const { route } = currentRoute();
  const total = checklist().length, found = foundCount();
  const others = ['sarah', 'jake', 'maya'].filter((id) => id !== p.id);
  return `<section class="summary-hero">
      <div class="big-check">${icon('check')}</div>
      <h1>Your Costco trip is ready.</h1>
      <p>${esc(p.displayName)} · ${state.routeMode === 'quick' ? 'Quick Trip' : 'Treasure Hunt'}</p>
    </section>
    <section class="card stats">
      <div><span class="tiny muted">Estimated basket</span><b>${money(subtotal())}</b><span class="tiny muted">estimated</span></div>
      <div><span class="tiny muted">Items found</span><b>${found} / ${total}</b><span class="tiny muted">checklist</span></div>
      <div><span class="tiny muted">Stops</span><b>${route.order.length}</b><span class="tiny muted">+ checkout</span></div>
    </section>
    <section class="card">
      <div class="eyebrow">${icon('route')} Your route</div>
      <div class="route-chips"><span class="rchip">Entrance</span>${route.order.map((d, i) => `<span class="rchip">${i + 1}. ${esc(DEPTS[d].label)}</span>`).join('')}
        ${route.discovery && !state.discoverySkipped ? `<span class="rchip disc">★ ${esc(DEPTS[route.discovery.dept].label)} (optional)</span>` : ''}<span class="rchip">Checkout</span></div>
    </section>
    <section class="card insight">${icon('sparkle')}<p>${esc(p.insight)}</p></section>
    <div class="cta-col">
      <button class="btn outline full" data-action="nav" data-view="map">${icon('map')}Back to map</button>
      <button class="btn red full lg" data-action="switch-member">${icon('user')}Switch member</button>
    </div>
    <p class="center small muted">Try another member: ${others.map((id) => `<a href="#/compass/${id}" data-action="pick-persona" data-persona="${id}">${PERSONAS[id].displayName}</a>`).join(' · ')}</p>
    <p class="center"><button class="link-btn" data-action="restart">${icon('refresh')}Start over</button></p>`;
}

export { VIEWS };
