// Deterministic, keyword-aware Compass assistant (spec §9, §17).
// The CompassAssistant interface lets a future server-side LLM adapter replace `deterministicAssistant`
// without UI changes; see docs/openai-adapter.example.mjs. No network calls happen here.
import { DATA } from './data.js';
import { INTENT_ITEMS, GENERIC_REASON, PRODUCT_WORDS, SARAH_MEALS } from './content.js';
import { PRODUCTS, PERSONAS, clean } from './ui.js';
import { nutritionOf } from './details.js';
import { locationOf, stockText } from './inventory.js';

const RULES = { ...DATA.chatRules, fallback: clean(DATA.chatRules.fallback), clinicalFallback: clean(DATA.chatRules.clinicalFallback) };
const has = (t, words) => words.some((w) => new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(t));

const KW = {
  family: [...RULES.keywords.family, 'dinners', 'meals for', 'kid'],
  dinner: ['dinner', 'dinners', 'meal plan', 'meals'],
  essentials: ['restock', 'essentials', 'buy again', 'last trip', 'refill', 'running low', 'usual'],
  protein: [...RULES.keywords.protein, 'high-protein', 'meal-prep', 'gym', 'gains', 'macros'],
  laptop: [...RULES.keywords.laptop, 'macbook', 'notebook pc', 'pc for'],
  household: [...RULES.keywords.household, 'roommates', 'bathroom', 'toilet', 'detergent', 'laundry', 'trash', 'apartment', 'household'],
  breakfast: ['breakfast', 'brunch', 'morning'],
  unit: ['unit', 'per unit', 'value', 'cheapest', 'best deal', 'cost per', 'bulk', 'split'],
  route: [...RULES.keywords.route, 'fastest', 'path', 'directions', 'get around', 'layout'],
  cost: ['cost', 'total', 'how much', 'budget', 'spend', 'price', 'afford'],
  stock: ['in stock', 'out of stock', 'available', 'availability', 'inventory', 'sold out', 'have any'],
  pharmacy: ['pharmacy', 'pickup', 'pick up', 'pick-up', 'prescription', 'rx'],
  clinical: ['dose', 'dosage', 'side effect', 'interact', 'symptom', 'diagnos', 'treat', 'should i take', 'is it safe', 'mg', 'fever', 'pain', 'sick', 'allerg', 'which medicine', 'what medicine', 'medication advice', 'what medication', 'which medication', 'overdose', 'antibiotic'],
  ambiguous: ['plan', 'trip', 'shop', 'need', 'list', 'help', 'what should', 'suggest', 'recommend', 'ideas'],
  unsupported: ['tire', 'tires', 'gas', 'fuel', 'travel', 'vacation', 'jewelry', 'ring', 'clothing', 'clothes', 'hearing', 'car ', 'insurance', 'sofa', 'couch', 'alcohol', 'wine', 'beer'],
  remove: ['remove', 'without', 'no more', 'delete', 'take off', 'drop the', "don't need", 'dont need'],
  greeting: ['hi', 'hello', 'hey', 'thanks', 'thank you'],
  nutritionQ: ['nutrition', 'calorie', 'sugar', 'sodium', 'carb', 'fiber', 'ingredient', 'label', 'how much protein', 'grams of protein', 'protein in', 'healthy', 'healthier', 'macros', 'servings'],
  locateQ: ['where', 'which aisle', 'what aisle', 'aisle', 'locate', 'in stock', 'out of stock', 'available', 'have any', 'do you have', 'sold out', 'inventory'],
  goalQ: ['how long', 'last us', 'last six', 'will this last', 'supply', 'my goal', 'on track', 'per person', 'per roommate', 'goal check'],
  addVerb: ['add', 'need', 'buy', 'get me', 'put', 'want', 'include'],
};

export function detect(text) {
  const t = ` ${text.toLowerCase()} `;
  const f = {};
  for (const k of Object.keys(KW)) f[k] = has(t, KW[k]);
  f.products = [];
  let rest = t;
  for (const [w, id] of PRODUCT_WORDS) {
    const re = new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es|ies|y)?(?![a-z])`, 'g');
    if (re.test(rest)) { if (!f.products.includes(id)) f.products.push(id); rest = rest.replace(re, ' '); }
  }
  // "laptop" handled as comparison; "paper towels"/"toilet" alone also hint household
  f.budget = (/\$\s?(\d{2,4})/.exec(text) || [])[1] ? Number(/\$\s?(\d{2,4})/.exec(text)[1]) : null;
  return f;
}

/**
 * @typedef {{ personaId: string, prompt: string, personalizationEnabled: boolean, cartIds: string[], subtotal: number, budget: number }} PlanInput
 * @typedef {{ kind: string, paragraphs: string[], items: {id:string, why?:string}[], suggestions: string[], remove: string[],
 *   meals?: any[], comparison?: boolean, pharmacy?: boolean, unitTable?: boolean, chips?: boolean, ctas?: boolean, routeHint?: boolean, notes: string[], budget?: number }} PlanResponse
 */

/** Deterministic assistant implementation of the CompassAssistant interface. */
export const deterministicAssistant = {
  /** @param {PlanInput} input @returns {PlanResponse} */
  generatePlan(input) {
    const { personaId, personalizationEnabled: pz } = input;
    const prompt = (input.prompt || '').slice(0, 500).trim();
    const P = PERSONAS[personaId];
    const f = detect(prompt);
    const R = { kind: 'plan', paragraphs: [], items: [], suggestions: [], remove: [], notes: [], ctas: true };
    const push = (ids, why) => ids.forEach((id) => { if (!R.items.find((x) => x.id === id)) R.items.push({ id, why }); });
    const suggest = (ids) => ids.forEach((id) => { if (!R.suggestions.includes(id) && !R.items.find((x) => x.id === id)) R.suggestions.push(id); });

    // 1) Clinical questions: always decline, never advise.
    if (f.clinical) {
      return { kind: 'clinical', paragraphs: [RULES.clinicalFallback], items: [], suggestions: [], remove: [], notes: [],
        pharmacy: personaId === 'sarah', chips: true, ctas: false };
    }

    // 1b) Out-of-scope categories with no supported intent → polite capability message.
    const core = f.household || f.protein || f.family || f.dinner || f.laptop || f.breakfast || f.essentials || f.unit || f.pharmacy || f.products.length;
    if (f.unsupported && !core) {
      return { kind: 'fallback', paragraphs: ['This beta can help with groceries, household essentials, electronics, and trip planning. Try one of these.'],
        items: [], suggestions: [], remove: [], notes: [], chips: true, ctas: false };
    }

    // 1c) Nutrition questions: label-style facts only, never dietary or medical advice.
    if (f.nutritionQ && !f.remove) {
      const cartFoods = input.cartIds.filter((id) => nutritionOf(id));
      const asked = f.products.filter((id) => nutritionOf(id));
      const ids = asked.length ? asked : cartFoods.slice(0, 4);
      const R2 = { kind: 'nutrition', paragraphs: [], items: [], suggestions: asked.filter((id) => !input.cartIds.includes(id)), remove: [], notes: [], nutrition: ids, goal: !asked.length && cartFoods.length > 0, ctas: false };
      if (f.products.length && !asked.length) R2.paragraphs.push(`I don't have label-style nutrition facts for ${f.products.map((id) => PRODUCTS[id].short).join(', ')} in this demo.`);
      else if (!ids.length) { R2.paragraphs.push('Ask about a specific food — for example, “How much protein is in the Greek yogurt?” — or build a list first and I\'ll summarize it.'); R2.chips = true; }
      else R2.paragraphs.push(asked.length ? `Here are the label facts for ${asked.map((id) => PRODUCTS[id].short).join(' and ')} per the label:` : 'Here is a nutrition snapshot of the foods on your list per the label:');
      if (f.healthy || /health/i.test(prompt)) R2.paragraphs.push("Compass doesn't label foods as healthy or unhealthy — these facts help you decide. For dietary or medical needs, check the package and talk with a professional.");
      
      return R2;
    }

    // 1d) "Where is X?" / "Is X in stock?" → mock inventory + aisle location.
    if (f.products.length && f.locateQ && !f.addVerb && !f.remove) {
      const ids = f.products;
      return { kind: 'locate', paragraphs: [ids.length === 1 ? `Here's where to find ${PRODUCTS[ids[0]].short} in the warehouse:` : 'Here is where to find those items:'],
        items: [], suggestions: ids.filter((id) => !input.cartIds.includes(id) && PRODUCTS[id].stock !== 'out' && PRODUCTS[id].kind !== 'electronics'), remove: [],
        locate: ids, notes: [], ctas: false };
    }

    // 1e) Goal check on the current list ("How long will this last six of us?")
    if (f.goalQ && !f.products.length) {
      const empty = !input.cartIds.length;
      const R3 = { kind: 'goal', paragraphs: [empty ? `Let's start from your mission — here's a suggested list, with a goal check below:` : `Here's how your current list stacks up against your goal:`],
        items: empty ? P.baseCart.map((id) => ({ id })) : [], suggestions: [], remove: [], notes: [], goal: true, ctas: true };
      return R3;
    }

    // 2) Removals ("remove the coffee")
    if (f.remove && f.products.length) {
      R.kind = 'edit'; R.remove = f.products.filter((id) => input.cartIds.includes(id));
      R.paragraphs.push(R.remove.length ? `Done — I removed ${R.remove.map((id) => PRODUCTS[id].name).join(', ')} from your list. Your route updates automatically.` : `That item isn't on your list right now, so there's nothing to remove.`);
      return R;
    }

    if (f.budget && f.budget >= 20 && f.budget <= 2000 && !f.laptop) R.budget = f.budget;

    // 3) Persona-specific mission intents
    let matched = false;
    if (personaId === 'sarah') {
      const dinners = f.dinner || (f.family && !f.essentials && !f.pharmacy && !f.products.includes('diapers'));
      const essentials = f.essentials || f.products.includes('diapers');
      if (dinners && (essentials || f.pharmacy)) {
        matched = true;
        R.paragraphs.push(`On it, ${P.displayName}. Three quick family dinners, a diaper restock${f.pharmacy ? ', and your pickup' : ''} — all in one trip.`);
        R.meals = SARAH_MEALS; push(INTENT_ITEMS.sarah.dinners); push(['diapers']); suggest(['marinara', 'paper-towels']); R.goal = true;
      } else if (dinners) {
        matched = true;
        R.paragraphs.push(`Here are three family dinners built from easy, repeatable staples${pz ? ' you already buy' : ''}:`);
        R.meals = SARAH_MEALS; push(INTENT_ITEMS.sarah.dinners); suggest(['marinara', 'diapers']); R.goal = true;
      } else if (essentials) {
        matched = true;
        R.paragraphs.push(pz ? `Restocking what you bought on your last trips — diapers, milk, eggs and dinner basics:` : `Personalization is off, so I'm not using your purchase history. Here's a general family-essentials list instead:`);
        push(INTENT_ITEMS.sarah.essentials); suggest(['paper-towels', 'marinara']);
      }
      if (f.pharmacy) {
        matched = true; R.pharmacy = true;
        if (!R.items.length) {
          R.paragraphs.push(`Your pickup status is below. Want me to build your family list so the pickup fits into the same trip?`);
          push(P.baseCart); suggest(['marinara', 'paper-towels']);
        }
        R.notes.push('Ask a pharmacist for medication questions.');
      }
    } else if (personaId === 'jake') {
      if (f.protein) {
        matched = true;
        R.paragraphs.push(`High-protein lunches for the week, around $${R.budget || P.budgetUsd}. Plan: five chicken, rice & veggie bowls, plus yogurt and bars for snacks.`);
        R.meals = [{ name: 'Mon–Fri lunch bowls', uses: 'Chicken + rice + frozen veg' }, { name: 'Breakfast / snack', uses: 'Greek yogurt + eggs' }, { name: 'Between classes', uses: 'Protein bars' }];
        push(INTENT_ITEMS.jake.protein); suggest(['bananas', 'peanut-butter']); R.goal = true;
      }
      if (f.laptop) {
        matched = true; R.comparison = true;
        R.paragraphs.push(`Two laptops under $900 are compared below. They're research items — not added to your grocery total. Save the comparison to add an Electronics stop to your route.`);
      }
      if (f.route && !matched) {
        matched = true; R.routeHint = true;
        R.paragraphs.push(input.cartIds.length ? `Your route is ready — tap Map my trip. Quick Trip keeps it to the required stops.` : `Let's give the route something to find. Here's your high-protein list; then tap Map my trip.`);
        if (!input.cartIds.length) push(INTENT_ITEMS.jake.protein);
      }
    } else if (personaId === 'maya') {
      if (f.household || f.essentials) {
        matched = true;
        const items = INTENT_ITEMS.maya.household;
        const total = items.reduce((s, id) => s + PRODUCTS[id].demoPriceUsd, 0);
        R.paragraphs.push(`Restocking for six. Here's a shared-essentials list near $${R.budget || P.budgetUsd} — about $${(total / 6).toFixed(2)} per roommate (estimate).`);
        push(items); suggest(['sponges', 'coffee']); R.goal = true;
      }
      if (f.unit) {
        matched = true; R.unitTable = true; R.goal = true;
        if (!R.items.length) { R.paragraphs.push(`Here's the unit price for each item on your shared list, so everyone can see the bulk value:`); push(INTENT_ITEMS.maya.household); suggest(['sponges', 'coffee']); }
      }
      if (f.breakfast && !matched) {
        matched = true; R.paragraphs.push(`Shared breakfast basics with a low cost per serving:`); push(INTENT_ITEMS.maya.breakfast); suggest(['coffee']);
      }
      if (f.route && !matched) {
        matched = true; R.routeHint = true;
        R.paragraphs.push(input.cartIds.length ? `Your route is ready — tap Map my trip. Quick Trip keeps it to the required stops.` : `First, your shared essentials list — then tap Map my trip for the route.`);
        if (!input.cartIds.length) { push(INTENT_ITEMS.maya.household); suggest(['sponges', 'coffee']); }
      }
    }

    // 4) Cross-persona category intents (meaningful custom input)
    const G = INTENT_ITEMS.generic;
    if (!matched) {
      if (f.laptop) { matched = true; R.comparison = true; R.paragraphs.push(`Here are two laptops under $900. They're comparison items, not added to your grocery total.`); }
      if (f.household) { matched = true; R.paragraphs.push(`Household supplies from the warehouse:`); push(G.household, GENERIC_REASON.household); }
      if (f.protein) { matched = true; R.paragraphs.push(`High-protein picks from the warehouse:`); push(G.protein, GENERIC_REASON.protein); }
      if (f.family || f.dinner) { matched = true; R.paragraphs.push(`Easy dinner building blocks:`); push(G.family, GENERIC_REASON.family); }
      if (f.breakfast) { matched = true; R.paragraphs.push(`Breakfast staples:`); push(G.breakfast, GENERIC_REASON.breakfast); }
      if (f.pharmacy) {
        matched = true; R.kind = 'info'; R.ctas = false;
        R.paragraphs.push(`Pharmacy pickup coordination is only part of Sarah's journey. ${RULES.clinicalFallback}`);
      }
    }

    // 5) Explicit product mentions ("add bananas")
    const mentioned = f.products.filter((id) => PRODUCTS[id].kind !== 'electronics');
    if (mentioned.length) {
      const fresh = mentioned.filter((id) => !R.items.find((x) => x.id === id));
      if (fresh.length) {
        push(fresh, GENERIC_REASON.product);
        if (!matched) R.paragraphs.push(`Added ${fresh.map((id) => PRODUCTS[id].name).join(', ')} to your list.`);
      }
      matched = true;
    }

    // 6) Cost / stock questions
    if (f.cost && !matched) {
      matched = true; R.kind = 'info';
      const sub = input.subtotal;
      R.paragraphs.push(input.cartIds.length
        ? `Your list is ${'$' + sub.toFixed(2)} against a $${input.budget} target — ${sub <= input.budget ? `$${(input.budget - sub).toFixed(2)} under` : `$${(sub - input.budget).toFixed(2)} over`}. Estimated total.`
        : `Your list is empty right now. Tap a suggestion and I'll estimate the total.`);
      R.ctas = !!input.cartIds.length;
    }
    

    // 7) Ambiguous → mission plan, labeled as suggested
    if (!matched && (f.ambiguous || f.greeting) && !f.unsupported) {
      matched = true; R.kind = 'mission';
      R.paragraphs.push(`${f.greeting ? `Hi ${P.displayName}! ` : ''}Here's a suggested plan based on your mission: “${P.mission}” (suggested, not confirmed — edit anything).`);
      push(P.baseCart); P.suggestions.forEach((s) => suggest([s.productId]));
      if (personaId === 'jake') R.comparison = true;
      if (personaId === 'sarah') R.pharmacy = true;
    }

    // 8) Fallback
    if (!matched) {
      return { kind: 'fallback', paragraphs: [
        f.unsupported ? 'This beta can help with groceries, household essentials, electronics, and trip planning. Try one of these.' : RULES.fallback,
      ], items: [], suggestions: [], remove: [], notes: R.notes, chips: true, ctas: false };
    }
    if (f.route) R.routeHint = true;
    
    return R;
  },
};

/** Swap point for a future adapter (must be server-side; never put keys in browser code). */
export const CompassAssistant = deterministicAssistant;
