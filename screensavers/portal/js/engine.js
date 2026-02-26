/**
 * engine.js — Portal core
 *
 * Loads destination modules from the registry, handles random selection,
 * manages HUD state, and drives the warp transition lifecycle.
 *
 * Each destination module must export a default object matching:
 *   {
 *     id:      string,        // unique slug
 *     name:    string,        // display name
 *     year:    string,        // e.g. "~1975"
 *     styles:  string,        // CSS to inject (scoped by your own class names)
 *     render(): string,       // returns full HTML for the desktop
 *     init(container, engine): void  // wires interactivity; call engine.jump() for portal
 *   }
 */

import { destinations } from '../destinations/registry.js';
import { warpOut, warpIn } from './warp.js';

const container  = document.getElementById('destination-container');
const hudDepth   = document.getElementById('hud-depth');
const hudEra     = document.getElementById('hud-era');

let currentId  = null;
let depth      = 0;
let styleEl    = null;

// ── Helpers ────────────────────────────────────────────────────────

function pickNext() {
  if (destinations.length === 0) throw new Error('No destinations registered.');
  const pool = destinations.length > 1
    ? destinations.filter(d => d.id !== currentId)
    : destinations;
  return pool[Math.floor(Math.random() * pool.length)];
}

function injectStyles(dest) {
  if (styleEl) styleEl.remove();
  styleEl = document.createElement('style');
  styleEl.id = 'portal-dest-styles';
  styleEl.textContent = dest.styles || '';
  document.head.appendChild(styleEl);
}

function updateHUD(dest) {
  hudDepth.textContent = `DEPTH: ${depth}`;
  hudEra.textContent   = `${dest.name}  ${dest.year}`;
}

async function load(dest) {
  injectStyles(dest);
  container.innerHTML = dest.render();
  currentId = dest.id;
  updateHUD(dest);
  // Let DOM settle before init
  await new Promise(r => requestAnimationFrame(r));
  dest.init(container, engine);
}

// ── Public engine API ──────────────────────────────────────────────

const engine = {
  /** Called by a destination when the user finds the portal */
  async jump() {
    depth++;
    await warpOut();
    await load(pickNext());
    await warpIn();
  },

  get depth() { return depth; },

  /** Convenience: lets destinations read all available ids */
  get destinationIds() { return destinations.map(d => d.id); }
};

// ── Boot ──────────────────────────────────────────────────────────

(async () => {
  // Initial load — no warp-out, just warp in from black
  await load(pickNext());
  await warpIn();
})();

// ESC → back to main site
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') window.location.href = '/';
});
