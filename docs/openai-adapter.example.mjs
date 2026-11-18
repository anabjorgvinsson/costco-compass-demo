// OPTIONAL, OFF BY DEFAULT, NOT DEPLOYED. Reference sketch only.
//
// The live demo is a static site and uses the deterministic assistant in js/chat.js.
// If the team later wants a live model, run something like this as a SERVER-SIDE function
// (e.g. a serverless endpoint) with the key in a server environment variable — never in browser code.
// The browser would POST { personaId, prompt, personalizationEnabled } and receive a PlanResponse
// with the same shape js/chat.js returns. Every product id is validated against the fixture and
// any claim about live inventory or clinical advice is rejected, falling back to the deterministic plan.

import { DATA } from '../js/data.js';
import { deterministicAssistant } from '../js/chat.js';

const ENABLED = process.env.COMPASS_LIVE_AI === 'true'; // default: off
const PRODUCT_IDS = new Set(DATA.products.map((p) => p.id));
const FORBIDDEN = /(in stock now|checked (live )?inventory|dosage|diagnos|you should take)/i;

export async function generatePlan(input) {
  const fallback = deterministicAssistant.generatePlan(input);
  if (!ENABLED || !process.env.OPENAI_API_KEY) return fallback;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.COMPASS_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You plan Costco Compass demo trips. Only use product ids from the provided catalog. Never claim live inventory or give medical advice. Reply as JSON {paragraphs:string[], items:{id,why}[], suggestions:string[]}.' },
          { role: 'user', content: JSON.stringify({ persona: DATA.personas[input.personaId].mission, prompt: input.prompt, catalog: [...PRODUCT_IDS] }) },
        ],
      }),
    });
    const out = JSON.parse((await res.json()).choices[0].message.content);
    const items = (out.items || []).filter((i) => PRODUCT_IDS.has(i.id));
    const text = (out.paragraphs || []).join(' ');
    if (!items.length || FORBIDDEN.test(text)) return fallback;
    return { ...fallback, kind: 'plan', paragraphs: out.paragraphs.slice(0, 3), items, suggestions: (out.suggestions || []).filter((id) => PRODUCT_IDS.has(id)) };
  } catch {
    return fallback;
  }
}
