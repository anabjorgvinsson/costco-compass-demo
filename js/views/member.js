// Surface A — personalized desktop homepage (responsive). Shares state with the Compass app.
import { clean, esc, icon, logo, money, productIcon, PRODUCTS, DEPTS } from '../ui.js';
import { state, persona, cartLine, subtotal, itemCount, openSuggestions, suggestionReason } from '../state.js';
import { avatar, membershipPill, personalizationToggle, pharmacyCard, DISCLAIMER, listBadge, deptChip } from './common.js';

export function memberView() {
  const p = persona();
  const pz = state.personalizationEnabled;
  const sugg = openSuggestions();
  const buyAgain = p.recentPurchases.map((r) => r.productId);

  const recent = p.recentPurchases.map((r) => {
    const pr = PRODUCTS[r.productId];
    return `<div class="receipt">
      <div class="pi lg">${productIcon(pr.id)}</div>
      <button class="receipt-name link-name" data-action="open-product" data-id="${pr.id}">${esc(pr.name)}</button>
      <div class="tiny muted">${esc(pr.unitLabel)} · Qty ${r.quantity}</div>
      <div class="receipt-foot"><span class="tiny">${icon('receipt')}${esc(r.when)}</span><b>${money(pr.demoPriceUsd)}</b></div>
    </div>`;
  }).join('');

  const buy = buyAgain.map((id) => {
    const pr = PRODUCTS[id];
    const inCart = !!cartLine(id);
    return `<div class="tile">
      <div class="tile-img">${productIcon(id)}</div>
      <div class="tile-price">${money(pr.demoPriceUsd)}</div>
      <button class="tile-name link-name" data-action="open-product" data-id="${id}">${esc(pr.name)}</button>
      <div class="tiny muted">${esc(pr.unitLabel)}</div>
      ${inCart ? `<button class="btn ghost sm full" data-action="remove-item" data-id="${id}">${icon('check')}On next trip · Undo</button>`
        : `<button class="btn outline sm full" data-action="add-item" data-id="${id}" data-source="manual">${icon('plus')}Add to next trip</button>`}
    </div>`;
  }).join('');

  const recs = sugg.length ? sugg.map((s) => {
    const pr = PRODUCTS[s.productId];
    const isLaptop = pr.kind === 'electronics';
    return `<div class="rec">
      <div class="pi">${productIcon(pr.id)}</div>
      <div class="rec-main"><button class="link-name" data-action="open-product" data-id="${pr.id}"><b>${esc(pr.name)}</b></button><div class="tiny muted">${money(pr.demoPriceUsd)} · ${esc(pr.unitLabel)}</div>
        <details class="why"><summary>${icon('sparkle')}Why this suggestion?</summary><p>${esc(suggestionReason(pr.id))}</p></details></div>
      <div class="rec-act">
        <button class="btn red sm" data-action="add-suggestion" data-id="${pr.id}">${isLaptop ? 'Compare in store' : 'Add to next trip'}</button>
        <button class="icon-btn sm" data-action="dismiss-suggestion" data-id="${pr.id}" aria-label="Remove suggestion ${esc(pr.name)}">${icon('x')}</button>
      </div>
    </div>`;
  }).join('') : `<p class="muted small">You've handled every suggestion. Ask Compass for more ideas.</p>`;

  const list = state.cart.slice(0, 5).map((l) => `<li><span>${esc(PRODUCTS[l.productId].name)}</span><span class="muted">×${l.quantity}</span></li>`).join('');

  return `<div class="desk">
    <div class="util-bar"><div class="wrap"><span>${icon('star')}Costco Compass · student concept</span><span>${icon('pin')}${esc(clean(p.homeWarehouse))}</span></div></div>
    <header class="desk-head"><div class="wrap">
      <a href="#/" class="logo-link" aria-label="Back to member picker">${logo('light', 'lg')}</a><span class="concept-tag">Student concept</span>
      <form class="search" data-form="search" role="search">
        ${icon('search')}<input name="q" type="search" placeholder="Ask Compass or search the warehouse…" aria-label="Ask Compass" autocomplete="off" maxlength="300">
        <button class="btn gold sm" type="submit">Ask</button>
      </form>
      <div class="head-acts">
        <button class="acct" data-action="switch-member" title="Switch member">${avatar(p, 'sm')}<span><small>Member</small>${esc(p.displayName)} · Switch</span></button>
        <a class="cart-btn" href="#/compass/${p.id}/list" aria-label="Shopping list, ${itemCount()} items">${icon('cart')}${listBadge()}</a>
      </div>
    </div>
    <nav class="desk-nav"><div class="wrap">
      <span class="nav-static" title="Not part of this prototype">Shop</span><span class="nav-static" title="Not part of this prototype">Grocery</span>
      <span class="nav-static" title="Not part of this prototype">Electronics</span><span class="nav-static" title="Not part of this prototype">Pharmacy</span>
      <a class="nav-compass" href="#/compass/${p.id}">${icon('compass')}Costco Compass</a>
    </div></nav></header>

    <main class="wrap desk-main">
      <section class="desk-hero">
        <div class="hero-left">
          <p class="eyebrow gold">Welcome back</p>
          <h1>Hello, ${esc(p.displayName)}. Ready for your next Costco trip?</h1>
          <div class="hero-meta">${membershipPill(p)}<span class="muted">${esc(p.subtitle)}</span></div>
          <p class="mission"><b>Today's mission:</b> ${esc(p.mission)}</p>
          <div class="chips">${p.promptChips.map((c) => `<button class="chip" data-action="send-prompt" data-prompt="${esc(c)}">${icon('sparkle')}${esc(c)}</button>`).join('')}</div>
          <button class="btn red lg" data-action="send-prompt" data-prompt="${esc(p.defaultPrompt)}">${icon('compass')}Plan my trip with Compass</button>
        </div>
        <aside class="card next-trip">
          <div class="eyebrow">${icon('route')} Your next Costco trip</div>
          ${state.cart.length ? `<ul class="mini-list">${list}</ul>${state.cart.length > 5 ? `<p class="tiny muted">+${state.cart.length - 5} more</p>` : ''}
            <div class="total-row"><span>Estimated total</span><b>${money(subtotal())}</b></div>`
            : `<p class="muted small">Your trip list is empty. Add items from Buy Again, or let Compass plan it.</p>`}
          <p class="tiny muted">${esc(p.routeNarrative)}</p>
          <a class="btn blue full" href="#/compass/${p.id}/${state.cart.length ? 'list' : 'chat'}">${state.cart.length ? 'Review list & map my trip' : 'Begin planning'}${icon('right')}</a>
        </aside>
      </section>

      <div class="desk-grid">
        <section class="card">
          <div class="sec-head"><h2>Your last purchases</h2><span class="tag">Receipts</span></div>
          ${pz ? '' : `<p class="note">${icon('shield')}Personalization is off — this history is not used by Compass.</p>`}
          <div class="receipts">${recent}</div>
        </section>
        <section class="card">
          <div class="sec-head"><h2>Compass recommends</h2><span class="tag gold">For your household</span></div>
          <div class="recs">${recs}</div>
        </section>
      </div>

      <section class="card">
        <div class="sec-head"><h2>Buy again</h2><span class="muted small">Adds to your Compass trip list</span></div>
        <div class="tiles">${buy}</div>
      </section>

      ${p.id === 'sarah' ? `<div class="desk-grid">${pharmacyCard()}<section class="card insight">${icon('sparkle')}<p>${esc(p.insight)}</p></section></div>` : `<section class="card insight">${icon('sparkle')}<p>${esc(p.insight)}</p></section>`}

      <section class="card privacy-card"><h2>Your data, your call</h2>${personalizationToggle()}</section>
    </main>
    <footer class="site-foot wrap">${icon('info')}<span>Costco Compass is a student concept · not affiliated with Costco Wholesale.</span>
      <button class="link-btn" data-action="restart">${icon('refresh')}Start over</button></footer>
  </div>`;
}

export { deptChip, DEPTS };
