// ILLUSTRATIVE product details for the demo: label-style nutrition, highlights, supply estimates and
// goal-fit explanations. Numbers are made-up approximations for a classroom mockup — not product labels,
// not dietary or medical advice.

// id: [serving, servingsPerPack, calories, fat g, carbs g, fiber g, sugars g, protein g, sodium mg]
const N = {
  milk: ['1 cup (240 mL)', 32, 120, 5, 12, 0, 12, 8, 115],
  eggs: ['1 large egg', 24, 70, 5, 0, 0, 0, 6, 70],
  'greek-yogurt': ['3/4 cup (170 g)', 8, 100, 0, 6, 0, 5, 18, 65],
  berries: ['1 cup', 4, 85, 0.5, 21, 4, 15, 1, 0],
  bananas: ['1 medium', 9, 105, 0.4, 27, 3, 14, 1, 0],
  apples: ['1 medium', 12, 95, 0.3, 25, 4, 19, 0.5, 0],
  'rotisserie-chicken': ['3 oz (85 g)', 10, 140, 7, 1, 0, 0, 19, 460],
  'chicken-frozen': ['4 oz (112 g)', 20, 120, 2, 0, 0, 0, 24, 220],
  'vegetables-frozen': ['3/4 cup', 30, 30, 0, 6, 2, 2, 1, 25],
  rice: ['1/4 cup dry (45 g)', 200, 160, 0, 36, 0, 0, 3, 0],
  tortillas: ['1 tortilla', 40, 140, 3.5, 24, 1, 1, 4, 330],
  pasta: ['2 oz dry (56 g)', 48, 200, 1, 42, 2, 2, 7, 0],
  marinara: ['1/2 cup', 18, 70, 3, 9, 2, 6, 2, 450],
  oats: ['1/2 cup dry (40 g)', 113, 150, 3, 27, 4, 1, 5, 0],
  granola: ['2/3 cup (60 g)', 16, 260, 10, 38, 5, 10, 7, 90],
  'protein-bars': ['1 bar (60 g)', 20, 190, 7, 23, 15, 1, 21, 150],
  coffee: ['1 cup brewed', 120, 0, 0, 0, 0, 0, 0, 5],
  water: ['1 bottle', 40, 0, 0, 0, 0, 0, 0, 0],
  'sparkling-water': ['1 can', 35, 0, 0, 0, 0, 0, 0, 0],
  'sports-drink': ['1 bottle (20 fl oz)', 28, 140, 0, 36, 0, 34, 0, 270],
  'cold-brew': ['1 can', 12, 15, 0, 3, 0, 0, 1, 25],
  'frozen-berries': ['1 cup', 14, 70, 0.5, 17, 4, 10, 1, 0],
  salmon: ['4 oz (112 g)', 12, 160, 7, 0, 0, 0, 23, 75],
  pizza: ['1/4 pizza', 16, 330, 15, 33, 2, 4, 15, 780],
  dumplings: ['6 pieces', 9, 210, 6, 30, 2, 3, 9, 560],
  waffles: ['2 waffles', 24, 180, 6, 30, 1, 3, 4, 350],
  'chicken-pot-pie': ['1 cup', 10, 420, 24, 36, 2, 3, 16, 760],
  'mac-cheese': ['1 cup', 8, 400, 22, 34, 1, 5, 17, 820],
  'street-tacos': ['2 tacos', 6, 380, 14, 36, 3, 2, 26, 690],
  hummus: ['2 tbsp', 32, 70, 5, 4, 2, 0, 2, 130],
  'orange-juice': ['8 fl oz', 16, 110, 0, 26, 0, 22, 2, 0],
  butter: ['1 tbsp', 192, 100, 11, 0, 0, 0, 0, 90],
  'shredded-cheese': ['1/4 cup', 40, 110, 9, 1, 0, 0, 7, 180],
  'string-cheese': ['1 stick', 48, 80, 6, 1, 0, 0, 7, 200],
  'almond-milk': ['1 cup', 24, 40, 3, 1, 0, 0, 1, 170],
  'peanut-butter': ['2 tbsp', 50, 190, 16, 7, 3, 2, 8, 0],
  'olive-oil': ['1 tbsp', 135, 120, 14, 0, 0, 0, 0, 0],
  'chicken-stock': ['1 cup', 24, 15, 0, 1, 0, 0, 2, 450],
  'mixed-nuts': ['1 oz (28 g)', 40, 170, 15, 6, 2, 1, 5, 90],
  'ground-beef': ['4 oz (112 g)', 18, 200, 12, 0, 0, 0, 22, 75],
  'chicken-thighs': ['4 oz (112 g)', 24, 150, 7, 0, 0, 0, 21, 90],
  'pork-tenderloin': ['4 oz (112 g)', 16, 120, 3, 0, 0, 0, 24, 55],
  croissants: ['1 croissant', 12, 290, 17, 30, 1, 6, 6, 310],
  muffins: ['1 muffin', 12, 440, 22, 56, 1, 32, 6, 380],
  bagels: ['1 bagel', 12, 280, 1.5, 56, 2, 6, 11, 450],
  'pumpkin-pie': ['1/12 pie', 12, 300, 12, 43, 2, 26, 5, 330],
  spinach: ['3 cups (85 g)', 5, 20, 0, 3, 2, 0, 2, 65],
  avocados: ['1/3 avocado', 18, 80, 7, 4, 3, 0, 1, 0],
  strawberries: ['8 medium', 7, 45, 0, 11, 3, 7, 1, 0],
  'sweet-peppers': ['3 peppers', 10, 25, 0, 6, 2, 4, 1, 0],
};

export function nutritionOf(id) {
  const n = N[id];
  if (!n) return null;
  const [serving, servings, calories, fat, carbs, fiber, sugars, protein, sodium] = n;
  return { serving, servings, calories, fat, carbs, fiber, sugars, protein, sodium };
}

/** Product highlights (made-up, demo). Missing ids fall back to generated highlights. */
const H = {
  diapers: ['Up to 12-hour leak protection', 'Hypoallergenic, fragrance-free', 'Size 4 fits about 22–37 lb'],
  'paper-towels': ['Create-A-Size half sheets cut waste', 'Two-ply, highly absorbent', '12 big rolls ≈ 2–3 weeks for a busy kitchen'],
  'toilet-paper': ['Two-ply, septic safe', '30 rolls in one trip', 'Lowest cost per roll in the aisle'],
  'laundry-detergent': ['HE compatible — works in all washers', '170 loads in one jug', 'Cold-water clean'],
  'dish-soap': ['Concentrated — a little goes far', 'Cuts grease fast', 'Two bottles for a shared kitchen'],
  'trash-bags': ['Flex-Tech stretch resists tears', 'Drawstring top', '200 bags ≈ 6–7 months for one kitchen'],
  sponges: ['Heavy-duty scrub side', 'Safe on most pots and pans', '12 sponges — swap weekly'],
  milk: ['Two 1-gallon jugs', '8 g protein per cup', 'Good for cereal, coffee and cooking'],
  eggs: ['Cage-free, Grade AA', '6 g protein per egg', 'Breakfast, baking or breakfast-for-dinner'],
  'greek-yogurt': ['18 g protein per serving', 'Plain & nonfat — add your own fruit', 'Works as a sour-cream swap'],
  bananas: ['Ripens on the counter in 2–4 days', 'Quick, portable snack', 'Pairs with yogurt or oats'],
  apples: ['Crisp and sweet', 'Lunchbox-friendly', 'Keeps 2+ weeks refrigerated'],
  'rotisserie-chicken': ['Ready to eat — dinner in minutes', '~19 g protein per 3 oz', 'Stretch into tacos, bowls and soup'],
  'chicken-frozen': ['Individually frozen — thaw only what you need', '24 g protein per 4 oz', 'Ideal for weekly meal prep'],
  'vegetables-frozen': ['Broccoli, cauliflower & carrots', 'Steam or microwave in minutes', 'No chopping, no waste'],
  rice: ['20 lb bulk bag', 'About 200 servings', 'Cooks in ~18 minutes'],
  tortillas: ['Soft taco size', 'Freezer-friendly', '40 count for several meals'],
  pasta: ['Organic durum wheat', 'Six 1-lb boxes', 'Ready in ~10 minutes'],
  marinara: ['Organic tomatoes', 'No added sugar', 'Three jars for pasta nights'],
  oats: ['100% whole grain', '113 servings in one bag', 'Lowest cost per breakfast in the warehouse'],
  granola: ['Ancient grains & seeds', 'Great on yogurt', 'Resealable bag'],
  'protein-bars': ['21 g protein, 1 g sugar per bar', '15 g fiber', 'Fits in a backpack'],
  coffee: ['Medium roast', 'Roughly 120 cups per bag', 'Ground for drip machines'],
  'laptop-a': ['14" Full HD display', 'Lightweight for class', 'Fast SSD storage'],
  'laptop-b': ['16" larger screen', '16 GB RAM for multitasking', 'Backlit keyboard'],
  'printer-paper': ['Bright white, 20 lb', 'Jam-resistant', 'Works in inkjet and laser'],
  vitamins: ['Supplement — not a substitute for a varied diet', 'Ask a pharmacist before starting supplements'],
};

export function highlightsOf(p, unitPriceText) {
  if (H[p.id]) return H[p.id];
  const out = [];
  const n = nutritionOf(p.id);
  if (n && n.protein >= 8) out.push(`${n.protein} g protein per serving`);
  out.push(`Bulk size: ${p.unitLabel}`);
  const up = unitPriceText(p);
  if (up) out.push(`About ${up}`);
  if (p.tags?.includes('family')) out.push('Family-friendly pick');
  if (p.tags?.includes('student')) out.push('Popular with students');
  return out.slice(0, 3);
}

/** Rough supply estimates for a shared household of six (made up). */
const SUPPLY_SIX = {
  'paper-towels': 'about 2 weeks', 'toilet-paper': 'about 3 weeks', 'laundry-detergent': 'about 5 weeks',
  'dish-soap': 'about 4 weeks', 'trash-bags': 'about 2 months', oats: 'about 3 weeks of breakfasts',
  eggs: 'about 4 breakfasts', bananas: 'about 2 days', sponges: 'about 6 weeks', coffee: 'about 2 weeks',
  'disinfecting-wipes': 'about 1 month', 'hand-soap': 'about 1 month',
};

/** Protein grams per demo dollar for a whole pack. */
export function proteinPerDollar(p) {
  const n = nutritionOf(p.id);
  if (!n || !n.protein) return 0;
  return (n.protein * n.servings) / p.demoPriceUsd;
}

/** One-line, persona-aware explanation of how a product supports the member's goal. */
export function goalFit(personaId, p, unitPriceText) {
  const n = nutritionOf(p.id);
  if (personaId === 'jake') {
    if (p.kind === 'electronics') return 'Compare in person — stays outside your $75 grocery budget.';
    if (n && n.protein >= 6) return `${n.protein} g protein per serving · ${proteinPerDollar(p).toFixed(0)} g protein per $ — supports your high-protein goal.`;
    if (n) return 'Low-cost side or snack to round out meal-prep bowls.';
  }
  if (personaId === 'sarah') {
    if (n) return `${n.servings} servings ≈ ${Math.max(1, Math.floor(n.servings / 4))} family portions for a household of four.`;
    if (p.tags?.includes('family') || p.tags?.includes('baby')) return 'Repeat family essential — one less stop later this month.';
  }
  if (personaId === 'maya') {
    const s = SUPPLY_SIX[p.id];
    const up = unitPriceText(p);
    return `${up ? up + ' · ' : ''}$${(p.demoPriceUsd / 6).toFixed(2)} per roommate${s ? ` · lasts ${s} for six` : ''}.`;
  }
  return '';
}

/** Goal summary for a set of cart product ids (used in chat replies). */
export function goalSummary(personaId, lines, products) {
  if (personaId === 'jake') {
    let protein = 0; const per = [];
    for (const l of lines) {
      const p = products[l.productId]; const n = nutritionOf(p.id);
      if (!n) continue;
      protein += n.protein * n.servings * l.quantity;
      if (n.protein >= 10) per.push([p.short, proteinPerDollar(p)]); // protein-dense foods only
    }
    per.sort((a, b) => b[1] - a[1]);
    return {
      title: 'Protein goal check',
      rows: [
        ['Protein in this list', `≈ ${Math.round(protein).toLocaleString()} g`],
        ['Per lunch bowl (4 oz chicken + rice + veg)', '≈ 28 g'],
        ['Best protein per $ (≥10 g/serving)', per.slice(0, 2).map(([n, v]) => `${n} (${v.toFixed(0)} g/$)`).join(', ')],
      ],
      note: 'Based on package nutrition labels · not dietary advice.',
    };
  }
  if (personaId === 'sarah') {
    const dinnerIds = ['rotisserie-chicken', 'tortillas', 'rice', 'vegetables-frozen', 'eggs', 'milk', 'apples', 'marinara', 'pasta'];
    const dinnerCost = lines.filter((l) => dinnerIds.includes(l.productId)).reduce((s, l) => s + products[l.productId].demoPriceUsd * l.quantity, 0);
    return {
      title: 'Family plan check',
      rows: [
        ['Dinner ingredients', `$${dinnerCost.toFixed(2)} → ≈ $${(dinnerCost / 12).toFixed(2)} per person per dinner`],
        ['Active cooking time', 'about 20 min per dinner — the rotisserie chicken is already cooked'],
        ['Left over for later', 'rice, tortillas and veggies cover 2+ more meals'],
      ],
      note: 'Based on 3 dinners × 4 people.',
    };
  }
  if (personaId === 'maya') {
    const total = lines.reduce((s, l) => s + products[l.productId].demoPriceUsd * l.quantity, 0);
    const lasting = lines.filter((l) => SUPPLY_SIX[l.productId]).slice(0, 3).map((l) => `${products[l.productId].short}: ${SUPPLY_SIX[l.productId]}`);
    return {
      title: 'Shared-household check',
      rows: [
        ['Split six ways', `$${(total / 6).toFixed(2)} per roommate`],
        ['How long it lasts for six', lasting.join(' · ') || '—'],
        ['Best value pick', 'KS Bath Tissue — lowest cost per roll in Aisle 2'],
      ],
      note: 'Supply is an estimate based on typical use.',
    };
  }
  return null;
}
