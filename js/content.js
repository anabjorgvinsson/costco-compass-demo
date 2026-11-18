// UI-only presentation content layered on top of the canonical fixtures in data.js.
// Nothing here changes a fixture price, ID, department or history.

/** Category icon used on product cards (plain line icons, no photos). */
export const PRODUCT_ICON = {
  diapers: 'baby', 'paper-towels': 'roll', 'toilet-paper': 'roll',
  'laundry-detergent': 'bottle', 'dish-soap': 'drop', 'trash-bags': 'bag', sponges: 'sponge',
  milk: 'milk', eggs: 'egg', 'greek-yogurt': 'cup', berries: 'leaf', bananas: 'leaf', apples: 'apple',
  'rotisserie-chicken': 'drumstick', 'chicken-frozen': 'snow', 'vegetables-frozen': 'snow',
  rice: 'grain', tortillas: 'grain', pasta: 'grain', marinara: 'jar', oats: 'grain', granola: 'grain',
  'protein-bars': 'bar', coffee: 'mug', 'laptop-a': 'laptop', 'laptop-b': 'laptop',
  'printer-paper': 'paper', vitamins: 'plus',
};

/** Short, map-legible department labels (lines). */
export const DEPT_LINES = {
  paper: ['Paper', 'Goods'], cleaning: ['Laundry &', 'Cleaning'], beverages: ['Beverages'],
  frozen: ['Frozen'], pharmacy: ['PHARMACY'], deli: ['Deli /', 'Rotisserie'],
  refrigerated: ['Refrigerated', 'Foods'], seasonal: ['Seasonal'], pantry: ['Pantry', 'Goods'],
  checkout: ['CHECKOUT'], meat: ['Meat /', 'Bakery'], dairy: ['Dairy /', 'Produce'],
  furniture: ['Furniture'], electronics: ['Electronics'], optical: ['OPTICAL'], office: ['Office / Misc.'],
};
export const VERTICAL_DEPTS = new Set(['pharmacy', 'checkout', 'optical']);

/** Illustrative laptop comparison attributes (demo only, not real models). */
export const LAPTOP_SPECS = {
  'laptop-a': { Processor: 'Intel Core i5', Screen: '14 in Full HD', Memory: '8 GB', Storage: '256 GB SSD', Battery: 'Up to 10 hrs*', Weight: '3.2 lb', 'Best for': 'Notes, browsing, docs' },
  'laptop-b': { Processor: 'Intel Core i7', Screen: '16 in WUXGA', Memory: '16 GB', Storage: '512 GB SSD', Battery: 'Up to 12 hrs*', Weight: '4.1 lb', 'Best for': 'Multitasking, coding' },
};

/** Treasure Hunt discovery stops, in priority order (first not already a required stop wins). */
export const DISCOVERY = {
  sarah: [
    { dept: 'seasonal', title: 'Seasonal family finds', blurb: 'Rotating seasonal items the kids might love. Browse only — nothing is added to your list.' },
    { dept: 'beverages', title: 'Drinks for the week', blurb: 'Browse family drinks. Browse only — nothing is added to your list.' },
  ],
  jake: [
    { dept: 'beverages', title: 'Drinks & snack discovery', blurb: 'Browse sports drinks and snacks for class days. Browse only — nothing is added to your list.' },
    { dept: 'seasonal', title: 'Seasonal finds', blurb: 'See what is new this season. Browse only — nothing is added to your list.' },
  ],
  maya: [
    { dept: 'beverages', title: 'Coffee & breakfast drinks', blurb: 'Check bulk coffee for the shared kitchen — ask your roommates first. Browse only.' },
    { dept: 'seasonal', title: 'Seasonal apartment finds', blurb: 'Rotating home items. Browse only — nothing is added to your list.' },
  ],
};

/** Per-persona reasons that do NOT rely on purchase history (always safe to show). */
export const REASONS = {
  sarah: {
    diapers: 'Part of your family-essentials restock',
    'rotisserie-chicken': 'Dinners 1 & 2: chicken tacos and rice bowls',
    milk: 'Family staple for the week',
    eggs: 'Dinner 3: breakfast-for-dinner',
    rice: 'Dinner 2: chicken & veggie rice bowls',
    tortillas: 'Dinner 1: rotisserie chicken tacos',
    'vegetables-frozen': 'Dinner 2: no-prep veggie side',
    apples: 'Easy kid-friendly side and snack',
    'paper-towels': 'Common household refill — add only if you need it',
    marinara: 'Pairs with an optional family pasta night',
  },
  jake: {
    'chicken-frozen': 'Main protein for five meal-prep lunches',
    'greek-yogurt': 'High-protein breakfast or snack',
    eggs: 'Low-cost protein',
    rice: 'Bulk base for meal-prep bowls',
    'vegetables-frozen': 'Bowl veggies with zero prep',
    'protein-bars': 'Protein snack between classes',
    bananas: 'Pairs well with yogurt; inexpensive snack',
    'printer-paper': 'Optional school supply',
  },
  maya: {
    'paper-towels': 'Shared-kitchen staple for six people',
    'laundry-detergent': '170 loads covers six roommates for weeks',
    'dish-soap': 'Shared kitchen — two bottles',
    'trash-bags': 'Six people fill a lot of bags',
    'toilet-paper': 'Bathroom basics for six',
    oats: 'Bulk breakfast with a low cost per pound',
    eggs: 'Shared breakfast protein',
    bananas: 'Cheapest shared breakfast fruit',
    sponges: 'Useful add-on for a shared kitchen; optional',
    coffee: 'May fit the shared breakfast restock — ask roommates first',
  },
};

/** Reasons used when a non-mission intent pulls catalog items for any persona. */
export const GENERIC_REASON = {
  household: 'Matches your request for household supplies',
  protein: 'High-protein pick',
  family: 'Easy family-dinner building block',
  breakfast: 'Breakfast staple',
  product: 'You asked for this item',
};

/** Product sets per intent. Persona-specific sets override the generic ones. */
export const INTENT_ITEMS = {
  generic: {
    household: ['paper-towels', 'toilet-paper', 'dish-soap', 'trash-bags', 'laundry-detergent'],
    protein: ['chicken-frozen', 'greek-yogurt', 'eggs', 'protein-bars'],
    family: ['rotisserie-chicken', 'tortillas', 'vegetables-frozen', 'rice', 'pasta', 'marinara'],
    breakfast: ['oats', 'eggs', 'bananas', 'greek-yogurt'],
  },
  sarah: {
    dinners: ['rotisserie-chicken', 'tortillas', 'rice', 'vegetables-frozen', 'eggs', 'milk', 'apples'],
    essentials: ['diapers', 'milk', 'eggs', 'rotisserie-chicken', 'apples'],
  },
  jake: { protein: ['chicken-frozen', 'greek-yogurt', 'eggs', 'rice', 'vegetables-frozen', 'protein-bars'] },
  maya: {
    household: ['paper-towels', 'laundry-detergent', 'dish-soap', 'trash-bags', 'toilet-paper', 'oats', 'eggs', 'bananas'],
    breakfast: ['oats', 'eggs', 'bananas'],
  },
};

export const SARAH_MEALS = [
  { name: 'Rotisserie chicken tacos', uses: 'Chicken + tortillas' },
  { name: 'Chicken & veggie rice bowls', uses: 'Leftover chicken, rice, frozen veg' },
  { name: 'Breakfast-for-dinner', uses: 'Eggs, milk, apples on the side' },
];

/** Product keyword → id map for free-text item mentions. Longest phrases first. */
export const PRODUCT_WORDS = [
  ['mac and cheese', 'mac-cheese'], ['mac & cheese', 'mac-cheese'], ['mac n cheese', 'mac-cheese'],
  ['paper towel', 'paper-towels'], ['toilet paper', 'toilet-paper'], ['tp', 'toilet-paper'],
  ['dish soap', 'dish-soap'], ['trash bag', 'trash-bags'], ['garbage bag', 'trash-bags'],
  ['protein bar', 'protein-bars'], ['greek yogurt', 'greek-yogurt'], ['yogurt', 'greek-yogurt'],
  ['rotisserie', 'rotisserie-chicken'], ['frozen chicken', 'chicken-frozen'],
  ['copy paper', 'printer-paper'], ['printer paper', 'printer-paper'],
  ['detergent', 'laundry-detergent'], ['diaper', 'diapers'], ['sponge', 'sponges'],
  ['milk', 'milk'], ['egg', 'eggs'], ['berries', 'berries'], ['berry', 'berries'], ['banana', 'bananas'],
  ['apple', 'apples'], ['veggie', 'vegetables-frozen'], ['vegetable', 'vegetables-frozen'],
  ['rice', 'rice'], ['tortilla', 'tortillas'], ['pasta', 'pasta'], ['marinara', 'marinara'],
  ['baby wipe', 'baby-wipes'], ['wipes', 'disinfecting-wipes'], ['tissue', 'facial-tissue'], ['kleenex', 'facial-tissue'], ['napkin', 'napkins'],
  ['paper plate', 'paper-plates'], ['foil', 'foil'], ['dishwasher', 'dish-pacs'], ['dryer sheet', 'dryer-sheets'], ['cleaner', 'all-purpose-cleaner'],
  ['sparkling', 'sparkling-water'], ['water', 'water'], ['gatorade', 'sports-drink'], ['sports drink', 'sports-drink'], ['cold brew', 'cold-brew'],
  ['k-cup', 'k-cups'], ['pods', 'k-cups'], ['tea', 'green-tea'], ['salmon', 'salmon'], ['pizza', 'pizza'], ['dumpling', 'dumplings'], ['waffle', 'waffles'],
  ['toothpaste', 'toothpaste'], ['hand soap', 'hand-soap'], ['bandage', 'bandages'], ['shampoo', 'shampoo'], ['sunscreen', 'sunscreen'],
  ['pot pie', 'chicken-pot-pie'], ['mac', 'mac-cheese'], ['taco kit', 'street-tacos'], ['hummus', 'hummus'], ['orange juice', 'orange-juice'], ['juice', 'orange-juice'],
  ['peanut butter', 'peanut-butter'], ['butter', 'butter'], ['string cheese', 'string-cheese'], ['cheese', 'shredded-cheese'], ['almond milk', 'almond-milk'],
  ['christmas tree', 'xmas-tree'], ['tree', 'xmas-tree'], ['gift wrap', 'gift-wrap'], ['advent', 'advent-calendar'], ['pajama', 'kids-pajamas'], ['lights', 'string-lights'],
  ['olive oil', 'olive-oil'], ['chicken stock', 'chicken-stock'], ['broth', 'chicken-stock'], ['nuts', 'mixed-nuts'],
  ['ground beef', 'ground-beef'], ['beef', 'ground-beef'], ['chicken thigh', 'chicken-thighs'], ['pork', 'pork-tenderloin'], ['croissant', 'croissants'],
  ['muffin', 'muffins'], ['bagel', 'bagels'], ['pie', 'pumpkin-pie'], ['spinach', 'spinach'], ['avocado', 'avocados'], ['strawberr', 'strawberries'], ['pepper', 'sweet-peppers'],
  ['office chair', 'office-chair'], ['chair', 'office-chair'], ['folding table', 'folding-table'], ['mattress', 'mattress-topper'], ['bookcase', 'bookcase'], ['bean bag', 'bean-bag'],
  ['tv', 'tv-55'], ['television', 'tv-55'], ['headphone', 'headphones'], ['tablet', 'tablet'], ['usb', 'usb-c-cables'], ['charger', 'usb-c-cables'], ['ssd', 'portable-ssd'],
  ['pens', 'pens'], ['sticky note', 'sticky-notes'], ['notebook', 'notebooks'], ['marker', 'markers'], ['reading glasses', 'reading-glasses'],
  ['oatmeal', 'oats'], ['oats', 'oats'], ['granola', 'granola'], ['coffee', 'coffee'], ['vitamin', 'vitamins'],
];

/** Extra UI-only chips in the chat dock that showcase inventory + nutrition help. */
export const EXTRA_CHIPS = {
  sarah: ['Where are the eggs?', 'Nutrition for my dinner list', 'Is the rotisserie chicken in stock?'],
  jake: ['How much protein is in Greek yogurt?', 'Where are the protein bars?', 'Compare laptops under $900'],
  maya: ['Are paper towels in stock?', 'Where is the coffee?', 'How long will this last six of us?'],
};
