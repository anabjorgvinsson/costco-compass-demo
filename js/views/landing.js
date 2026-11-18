import { esc, icon, logo, PERSONAS, moneyShort, clean } from '../ui.js';
import { avatar, DISCLAIMER } from './common.js';

/** First screen: brand splash with Shop now / Log in. */
export function welcomeView() {
  return `<div class="welcome">
    <div class="welcome-bg" aria-hidden="true"><span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span></div>
    <main class="welcome-main">
      <div class="welcome-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18.5" fill="#073B8E" stroke="#E2B13C" stroke-width="2.2"/>
          <circle cx="20" cy="20" r="13" fill="none" stroke="#E2B13C" stroke-width="1" stroke-dasharray="1.5 3.2" opacity=".85"/>
          <g class="needle"><path d="M20 6.5l4.2 13.5H15.8z" fill="#E2B13C"/><path d="M20 33.5l-4.2-13.5h8.4z" fill="#ffffff"/></g>
          <circle cx="20" cy="20" r="2.4" fill="#D7193F"/>
        </svg>
      </div>
      <h1 class="welcome-word"><b>Costco</b><i>Compass</i></h1>
      <p class="welcome-tag">Your membership. Your needs. Your way.</p>
      <ul class="welcome-feats">
        <li>${icon('sparkle')}Plan</li><li>${icon('map')}Navigate</li><li>${icon('gem')}Discover</li>
      </ul>
    </main>
    <div class="welcome-actions">
      <a class="btn red full lg" href="#/login?via=shop">${icon('cart')}Shop now</a>
      <a class="btn white-outline full lg" href="#/login">${icon('user')}Log in</a>
      <p class="welcome-foot">${icon('info')}${DISCLAIMER}</p>
    </div>
  </div>`;
}

/** Member picker, presented as a one-tap log-in. */
export function landingView(via) {
  const shop = via === 'shop';
  const cards = ['sarah', 'jake', 'maya'].map((id) => {
    const p = PERSONAS[id];
    return `<a class="persona-card" href="#/compass/${id}" data-action="pick-persona" data-persona="${id}">
      ${avatar(p, 'lg')}
      <span class="pc-body">
        <span class="pc-title">${shop ? 'Shop' : 'Log in'} as ${esc(p.displayName)}</span>
        <span class="pc-sub">${esc(p.subtitle)}</span>
        <span class="pc-mission">${esc(p.mission)}</span>
        <span class="pc-tags"><span class="tag gold">${moneyShort(p.budgetUsd)} budget</span><span class="tag">${esc(clean(p.membership))} Member</span></span>
      </span>
      <span class="pc-go">${icon('right')}</span>
    </a>`;
  }).join('');

  return `<div class="landing">
    <header class="landing-hero compact">
      <div class="hero-glow"></div>
      <a href="#/" class="hero-back" aria-label="Back to welcome">${icon('left')}</a>
      ${logo('light', 'lg')}
      <h1>${shop ? 'Who’s shopping today?' : 'Log in to Costco Compass'}</h1>
      <p class="lede">Choose a member account — step into the shoes of a Costco member.</p>
      <p class="login-note">${icon('shield')}One tap · no password needed</p>
    </header>
    <main class="landing-main">
      <h2 class="section-label">Member accounts</h2>
      <div class="persona-list">${cards}</div>
      <ol class="how">
        <li><span>${icon('compass')}</span><b>Ask</b> Compass for a plan</li>
        <li><span>${icon('list')}</span><b>Edit</b> your list</li>
        <li><span>${icon('map')}</span><b>Follow</b> your route</li>
      </ol>
      <p class="desk-links">On a big screen? Open the desktop homepage:
        ${['sarah', 'jake', 'maya'].map((id) => `<a href="#/member/${id}">${PERSONAS[id].displayName}</a>`).join(' · ')}</p>
    </main>
    <footer class="site-foot">${icon('info')}<span>${DISCLAIMER} No sign-up, payment, or real account access. Costco Compass is a student concept for a Vanderbilt course — not affiliated with or endorsed by Costco Wholesale.</span></footer>
  </div>`;
}
