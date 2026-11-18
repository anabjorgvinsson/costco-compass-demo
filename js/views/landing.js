import { esc, icon, logo, PERSONAS, moneyShort } from '../ui.js';
import { avatar, DISCLAIMER } from './common.js';

export function landingView() {
  const cards = ['sarah', 'jake', 'maya'].map((id) => {
    const p = PERSONAS[id];
    return `<a class="persona-card" href="#/compass/${id}" data-action="pick-persona" data-persona="${id}">
      ${avatar(p, 'lg')}
      <span class="pc-body">
        <span class="pc-title">Shop as ${esc(p.displayName)}</span>
        <span class="pc-sub">${esc(p.subtitle)}</span>
        <span class="pc-mission">${esc(p.mission)}</span>
        <span class="pc-tags"><span class="tag gold">${moneyShort(p.budgetUsd)} budget</span><span class="tag">${esc(p.membership.replace(' (demo)', ''))}</span></span>
      </span>
      <span class="pc-go">${icon('right')}</span>
    </a>`;
  }).join('');

  return `<div class="landing">
    <header class="landing-hero">
      <div class="hero-glow"></div>
      ${logo('light', 'xl')}
      <p class="eyebrow light">Student concept · Board demo</p>
      <h1>Experience Costco Compass</h1>
      <p class="lede">Step into the shoes of a Costco member.</p>
      <p class="tagline">Your membership. Your needs. Your way.</p>
    </header>
    <main class="landing-main">
      <h2 class="section-label">Choose a member</h2>
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
