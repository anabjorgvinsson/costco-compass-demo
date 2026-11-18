// MOCK warehouse inventory for the demo. Every name, item number, price, quantity and shelf location
// here is illustrative — not live Costco data. Fixture product IDs and prices from data.js are preserved;
// this file only adds specific display names, shelf placement, mock stock, and extra browse-only items.
import { DATA } from './data.js?v=20261117202059';

/** Aisle presentation per department. style: rack | cooler | counter | service */
export const AISLES = {
  office:       { aisle: 'Aisle 1',  style: 'rack',    blurb: 'Office & school supplies' },
  paper:        { aisle: 'Aisle 2',  style: 'rack',    blurb: 'Paper goods, baby & household paper' },
  cleaning:     { aisle: 'Aisle 4',  style: 'rack',    blurb: 'Laundry, dish & cleaning' },
  beverages:    { aisle: 'Aisle 6',  style: 'rack',    blurb: 'Water, coffee, sports drinks' },
  frozen:       { aisle: 'Aisle 8',  style: 'cooler',  blurb: 'Freezer doors' },
  pharmacy:     { aisle: 'Aisle 10', style: 'rack',    blurb: 'Vitamins, personal care & pharmacy pickup' },
  deli:         { aisle: 'Deli',     style: 'counter', blurb: 'Rotisserie & prepared foods case' },
  refrigerated: { aisle: 'Aisle 12', style: 'cooler',  blurb: 'Cooler doors — milk, yogurt, cheese' },
  seasonal:     { aisle: 'Center 14–16', style: 'rack', blurb: 'Rotating holiday & seasonal finds' },
  pantry:       { aisle: 'Aisle 18', style: 'rack',    blurb: 'Dry goods, sauces & snacks' },
  meat:         { aisle: 'Meat & Bakery', style: 'counter', blurb: 'Meat case and bakery tables' },
  dairy:        { aisle: 'Produce Room', style: 'cooler', blurb: 'Cold produce room & eggs' },
  furniture:    { aisle: 'Aisle 24', style: 'rack',    blurb: 'Furniture & dorm basics' },
  electronics:  { aisle: 'Aisle 26', style: 'rack',    blurb: 'Computers, TVs & audio' },
  optical:      { aisle: 'Optical',  style: 'service', blurb: 'Optical services',
    services: ['Eye exams by independent optometrist — by appointment', 'Frame fitting & adjustments'] },
  checkout:     { aisle: 'Front',    style: 'service', blurb: 'Checkout lanes',
    services: ['Staffed lanes 1–12', 'Self-checkout 13–20', 'Receipt check at exit'] },
};

export const SLOT_NAMES = {
  rack: { bay: (i) => `Bay ${'ABCD'[i]}`, level: ['Top shelf (overstock)', 'Eye level', 'Pallet level'] },
  cooler: { bay: (i) => `Door ${i + 1}`, level: ['Top shelf', 'Middle shelf', 'Bottom shelf'] },
  counter: { bay: (i) => `Case ${i + 1}`, level: ['Top tier', 'Front of case', 'Lower tier'] },
};

// Fixture products → [specific display name, short shelf label, mock stock]
const CORE = {
  diapers: ['Kirkland Signature Diapers, Size 4', 'KS Diapers Size 4', 'in'],
  'paper-towels': ['Kirkland Signature Create-A-Size Paper Towels', 'KS Paper Towels', 'in'],
  'toilet-paper': ['Kirkland Signature 2-Ply Bath Tissue', 'KS Bath Tissue', 'low'],
  'laundry-detergent': ['Kirkland Signature Ultra Clean HE Liquid Laundry Detergent', 'KS Laundry Detergent', 'in'],
  'dish-soap': ['Dawn Ultra Dishwashing Liquid, 2-Pack', 'Dawn Dish Soap 2-pk', 'in'],
  'trash-bags': ['Kirkland Signature Flex-Tech 13-Gallon Kitchen Trash Bags', 'KS Flex-Tech Bags', 'in'],
  sponges: ['Scotch-Brite Heavy Duty Scrub Sponges', 'Scotch-Brite Sponges', 'in'],
  milk: ['Kirkland Signature 2% Reduced Fat Milk, 2-Pack', 'KS 2% Milk 2-pk', 'in'],
  eggs: ['Kirkland Signature Cage-Free Large Eggs', 'KS Cage-Free Eggs', 'low'],
  'greek-yogurt': ['Kirkland Signature Plain Nonfat Greek Yogurt', 'KS Greek Yogurt', 'in'],
  berries: ['Organic Blueberries', 'Organic Blueberries', 'in'],
  bananas: ['Bananas, 3 lb Bunch', 'Bananas', 'in'],
  apples: ['Honeycrisp Apples, 5 lb Bag', 'Honeycrisp Apples', 'in'],
  'rotisserie-chicken': ['Kirkland Signature Seasoned Rotisserie Chicken', 'KS Rotisserie Chicken', 'in'],
  'chicken-frozen': ['Kirkland Signature Boneless Skinless Chicken Breasts (Frozen)', 'KS Frozen Chicken Breast', 'in'],
  'vegetables-frozen': ['Kirkland Signature Normandy-Style Vegetable Blend', 'KS Normandy Veg Blend', 'in'],
  rice: ['Kirkland Signature Long Grain White Rice', 'KS Long Grain Rice', 'in'],
  tortillas: ['Mission Soft Taco Flour Tortillas', 'Mission Tortillas', 'in'],
  pasta: ['Kirkland Signature Organic Spaghetti, 6-Pack', 'KS Organic Spaghetti', 'in'],
  marinara: ['Kirkland Signature Organic Marinara Sauce, 3-Pack', 'KS Organic Marinara', 'in'],
  oats: ['Quaker Old Fashioned Oats', 'Quaker Oats', 'in'],
  granola: ['Kirkland Signature Organic Ancient Grain Granola', 'KS Granola', 'in'],
  'protein-bars': ['Kirkland Signature Protein Bars, Chocolate Variety', 'KS Protein Bars', 'low'],
  coffee: ['Kirkland Signature House Blend Medium Roast Ground Coffee', 'KS House Blend Coffee', 'in'],
  'laptop-a': ['HP 14" Laptop – Intel Core i5, 8GB RAM, 256GB SSD', 'HP 14" Laptop', 'in'],
  'laptop-b': ['Lenovo IdeaPad Slim 5 16" – Intel Core i7, 16GB RAM, 512GB SSD', 'Lenovo IdeaPad 5', 'low'],
  'printer-paper': ['Hammermill Copy Plus Paper, 8.5" x 11"', 'Hammermill Paper', 'in'],
  vitamins: ['Kirkland Signature Daily Multi', 'KS Daily Multi', 'in'],
};

// Browse-only mock inventory: [id, dept, name, short, price, unit, stock, kind, tags]
const EXTRA = [
  ['baby-wipes', 'paper', 'Kirkland Signature Baby Wipes, Fragrance Free', 'KS Baby Wipes', 24.99, '900 count', 'in', 'home', ['baby', 'wipes', 'family']],
  ['facial-tissue', 'paper', 'Kleenex Ultra Soft Facial Tissue, 12-Pack', 'Kleenex 12-pk', 21.99, '12 boxes', 'in', 'home', ['tissue']],
  ['napkins', 'paper', 'Kirkland Signature 2-Ply Dinner Napkins', 'KS Napkins', 15.99, '540 count', 'in', 'home', ['napkins']],
  ['paper-plates', 'paper', 'Kirkland Signature 10" Paper Plates', 'KS Paper Plates', 18.99, '204 count', 'low', 'home', ['plates', 'party']],
  ['foil', 'paper', 'Kirkland Signature Foodservice Foil', 'KS Foil', 19.99, '500 sq ft', 'out', 'home', ['foil']],
  ['dish-pacs', 'cleaning', 'Kirkland Signature Dishwasher Detergent Pacs', 'KS Dishwasher Pacs', 13.99, '115 count', 'in', 'home', ['dishwasher', 'cleaning']],
  ['disinfecting-wipes', 'cleaning', 'Clorox Disinfecting Wipes, 5-Pack', 'Clorox Wipes 5-pk', 19.99, '425 count', 'in', 'home', ['wipes', 'cleaning', 'shared']],
  ['dryer-sheets', 'cleaning', 'Kirkland Signature Ultra Soft Dryer Sheets', 'KS Dryer Sheets', 9.99, '250 count', 'low', 'home', ['laundry']],
  ['all-purpose-cleaner', 'cleaning', 'Method All-Purpose Cleaner, 3-Pack', 'Method Cleaner 3-pk', 12.99, '3 bottles', 'out', 'home', ['cleaner', 'cleaning']],
  ['water', 'beverages', 'Kirkland Signature Purified Bottled Water', 'KS Bottled Water', 4.99, '40 bottles', 'in', 'grocery', ['water', 'drinks']],
  ['sparkling-water', 'beverages', 'Kirkland Signature Sparkling Water, Variety Pack', 'KS Sparkling Water', 9.99, '35 cans', 'in', 'grocery', ['sparkling', 'drinks']],
  ['sports-drink', 'beverages', 'Gatorade Thirst Quencher Variety Pack', 'Gatorade Variety', 18.99, '28 bottles', 'in', 'grocery', ['gatorade', 'drinks', 'fitness']],
  ['cold-brew', 'beverages', 'Kirkland Signature Cold Brew Coffee', 'KS Cold Brew', 19.99, '12 cans', 'low', 'grocery', ['coffee', 'cold brew']],
  ['k-cups', 'beverages', 'Kirkland Signature Pacific Bold K-Cup Pods', 'KS Pacific Bold Pods', 34.99, '120 count', 'in', 'grocery', ['coffee', 'pods']],
  ['green-tea', 'beverages', 'Kirkland Signature Green Tea Bags', 'KS Green Tea', 11.99, '100 bags', 'out', 'grocery', ['tea']],
  ['frozen-berries', 'frozen', 'Kirkland Signature Three-Berry Blend (Frozen)', 'KS Three-Berry Blend', 12.99, '4 lb', 'in', 'grocery', ['berries', 'smoothie']],
  ['salmon', 'frozen', 'Kirkland Signature Wild Alaskan Sockeye Salmon Fillets', 'KS Sockeye Salmon', 29.99, '3 lb', 'low', 'grocery', ['salmon', 'fish', 'protein']],
  ['pizza', 'frozen', 'Kirkland Signature Thin Crust Pepperoni Pizza, 4-Pack', 'KS Pepperoni Pizza', 15.99, '4 pizzas', 'in', 'grocery', ['pizza', 'dinner']],
  ['dumplings', 'frozen', 'Bibigo Chicken & Vegetable Mandu', 'Bibigo Mandu', 13.99, '3 lb', 'in', 'grocery', ['dumplings']],
  ['waffles', 'frozen', 'Eggo Homestyle Waffles', 'Eggo Waffles', 9.99, '48 count', 'out', 'grocery', ['waffles', 'breakfast']],
  ['toothpaste', 'pharmacy', 'Crest Pro-Health Toothpaste, 5-Pack', 'Crest Toothpaste 5-pk', 16.99, '5 tubes', 'in', 'other', ['toothpaste', 'bathroom']],
  ['hand-soap', 'pharmacy', 'Kirkland Signature Foaming Hand Soap Refill', 'KS Hand Soap', 12.99, '2 bottles', 'in', 'other', ['soap', 'bathroom', 'shared']],
  ['bandages', 'pharmacy', 'Kirkland Signature Flexible Fabric Bandages', 'KS Bandages', 9.99, '200 count', 'in', 'other', ['bandages', 'first aid']],
  ['shampoo', 'pharmacy', 'Kirkland Signature Moisture Shampoo', 'KS Shampoo', 9.99, '2 bottles', 'low', 'other', ['shampoo', 'bathroom']],
  ['sunscreen', 'pharmacy', 'Kirkland Signature Sport Sunscreen SPF 50, 2-Pack', 'KS Sunscreen 2-pk', 18.99, '2 bottles', 'out', 'other', ['sunscreen']],
  ['chicken-pot-pie', 'deli', 'Kirkland Signature Chicken Pot Pie', 'KS Chicken Pot Pie', 17.99, 'about 5 lb', 'low', 'grocery', ['dinner', 'family']],
  ['mac-cheese', 'deli', 'Kirkland Signature Macaroni & Cheese', 'KS Mac & Cheese', 15.99, 'about 4 lb', 'in', 'grocery', ['dinner', 'family', 'kids']],
  ['street-tacos', 'deli', 'Kirkland Signature Chicken Street Taco Kit', 'KS Street Taco Kit', 19.99, 'serves 6', 'in', 'grocery', ['tacos', 'dinner', 'family']],
  ['hummus', 'deli', 'Sabra Classic Hummus', 'Sabra Hummus', 7.99, '32 oz', 'in', 'grocery', ['hummus', 'snack']],
  ['orange-juice', 'refrigerated', 'Kirkland Signature Organic Orange Juice, 2-Pack', 'KS Orange Juice 2-pk', 9.99, '2 × 64 fl oz', 'in', 'grocery', ['juice', 'breakfast']],
  ['butter', 'refrigerated', 'Kirkland Signature Salted Butter', 'KS Salted Butter', 12.99, '4 lb', 'in', 'grocery', ['butter']],
  ['shredded-cheese', 'refrigerated', 'Kirkland Signature Shredded Mexican-Style Blend Cheese', 'KS Mexican Blend', 10.99, '2.5 lb', 'in', 'grocery', ['cheese', 'tacos']],
  ['string-cheese', 'refrigerated', 'Kirkland Signature Mozzarella String Cheese', 'KS String Cheese', 11.99, '48 count', 'low', 'grocery', ['cheese', 'snack', 'kids']],
  ['almond-milk', 'refrigerated', 'Kirkland Signature Organic Almond Milk, 6-Pack', 'KS Almond Milk 6-pk', 9.99, '6 × 32 fl oz', 'out', 'grocery', ['milk']],
  ['xmas-tree', 'seasonal', 'Kirkland Signature 7.5\' Pre-Lit Artificial Christmas Tree', 'KS 7.5\' Pre-Lit Tree', 299.99, '1 tree', 'in', 'seasonal', ['holiday', 'tree']],
  ['gift-wrap', 'seasonal', 'Kirkland Signature Holiday Gift Wrap, 3 Rolls', 'KS Gift Wrap', 19.99, '3 rolls', 'in', 'seasonal', ['holiday', 'gift']],
  ['advent-calendar', 'seasonal', 'Holiday Chocolate Advent Calendar', 'Advent Calendar', 14.99, '1 calendar', 'low', 'seasonal', ['holiday', 'kids']],
  ['kids-pajamas', 'seasonal', 'Kids\' Holiday Pajama Set, 2-Pack', 'Kids\' Holiday PJs', 16.99, '2 sets', 'in', 'seasonal', ['holiday', 'kids']],
  ['string-lights', 'seasonal', 'LED Warm White String Lights, 2-Pack', 'LED String Lights', 24.99, '2 strands', 'out', 'seasonal', ['holiday', 'lights']],
  ['peanut-butter', 'pantry', 'Kirkland Signature Organic Creamy Peanut Butter, 2-Pack', 'KS Peanut Butter 2-pk', 10.99, '2 × 28 oz', 'in', 'grocery', ['peanut butter', 'protein']],
  ['olive-oil', 'pantry', 'Kirkland Signature Extra Virgin Olive Oil', 'KS Olive Oil', 19.99, '2 L', 'in', 'grocery', ['olive oil']],
  ['chicken-stock', 'pantry', 'Kirkland Signature Organic Chicken Stock, 6-Pack', 'KS Chicken Stock', 12.99, '6 × 32 oz', 'low', 'grocery', ['stock', 'soup']],
  ['mixed-nuts', 'pantry', 'Kirkland Signature Extra Fancy Mixed Nuts', 'KS Mixed Nuts', 17.99, '2.5 lb', 'in', 'grocery', ['nuts', 'snack']],
  ['ground-beef', 'meat', 'Kirkland Signature Ground Beef 88/12', 'KS Ground Beef', 24.99, 'about 4.5 lb', 'in', 'grocery', ['beef', 'dinner', 'protein']],
  ['chicken-thighs', 'meat', 'Kirkland Signature Boneless Chicken Thighs', 'KS Chicken Thighs', 17.99, 'about 6 lb', 'in', 'grocery', ['chicken', 'protein']],
  ['pork-tenderloin', 'meat', 'Kirkland Signature Pork Tenderloin', 'KS Pork Tenderloin', 14.99, 'about 4 lb', 'low', 'grocery', ['pork', 'dinner']],
  ['croissants', 'meat', 'Kirkland Signature Butter Croissants', 'KS Croissants', 6.99, '12 count', 'in', 'grocery', ['bakery', 'breakfast']],
  ['muffins', 'meat', 'Kirkland Signature Blueberry Muffins', 'KS Muffins', 10.99, '12 count', 'in', 'grocery', ['bakery', 'breakfast']],
  ['bagels', 'meat', 'Kirkland Signature Plain Bagels', 'KS Bagels', 7.99, '12 count', 'low', 'grocery', ['bakery', 'breakfast']],
  ['pumpkin-pie', 'meat', 'Kirkland Signature Pumpkin Pie, 12"', 'KS Pumpkin Pie', 6.99, '1 pie', 'out', 'grocery', ['bakery', 'holiday', 'pie']],
  ['spinach', 'dairy', 'Organic Baby Spinach', 'Organic Spinach', 4.99, '1 lb', 'in', 'grocery', ['spinach', 'vegetables']],
  ['avocados', 'dairy', 'Hass Avocados, Bag of 6', 'Avocados (6)', 6.99, '6 count', 'in', 'grocery', ['avocado', 'tacos']],
  ['strawberries', 'dairy', 'Strawberries, 2 lb Clamshell', 'Strawberries', 5.99, '2 lb', 'low', 'grocery', ['strawberries', 'fruit']],
  ['sweet-peppers', 'dairy', 'Mini Sweet Peppers', 'Mini Sweet Peppers', 5.49, '2 lb', 'out', 'grocery', ['peppers', 'vegetables']],
  ['office-chair', 'furniture', 'Mesh-Back Ergonomic Office Chair', 'Mesh Office Chair', 149.99, '1 chair', 'in', 'home', ['chair', 'dorm']],
  ['folding-table', 'furniture', '6\' Fold-in-Half Folding Table', '6\' Folding Table', 59.99, '1 table', 'in', 'home', ['table']],
  ['mattress-topper', 'furniture', 'Twin XL Memory Foam Mattress Topper', 'Twin XL Topper', 69.99, '1 topper', 'low', 'home', ['dorm', 'bed']],
  ['bookcase', 'furniture', '3-Shelf Bookcase', '3-Shelf Bookcase', 89.99, '1 bookcase', 'in', 'home', ['shelf']],
  ['bean-bag', 'furniture', 'Oversized Bean Bag Lounger', 'Bean Bag Lounger', 99.99, '1 lounger', 'out', 'home', ['dorm']],
  ['tv-55', 'electronics', '55" Class 4K UHD Smart TV', '55" 4K Smart TV', 349.99, '1 TV', 'in', 'electronics', ['tv', 'television']],
  ['headphones', 'electronics', 'Wireless Noise-Cancelling Headphones', 'ANC Headphones', 129.99, '1 pair', 'in', 'electronics', ['headphones', 'audio']],
  ['tablet', 'electronics', '10.9" Tablet, 64GB Wi-Fi', '10.9" Tablet', 349.99, '1 tablet', 'low', 'electronics', ['tablet', 'student']],
  ['usb-c-cables', 'electronics', 'USB-C Charging Cables, 3-Pack', 'USB-C Cables 3-pk', 19.99, '3 cables', 'in', 'electronics', ['cable', 'charger', 'student']],
  ['portable-ssd', 'electronics', '1TB Portable SSD', '1TB Portable SSD', 79.99, '1 drive', 'out', 'electronics', ['storage', 'student']],
  ['pens', 'office', 'Ballpoint Pens, Medium Point, 60-Pack', 'Ballpoint Pens 60-pk', 9.99, '60 count', 'in', 'home', ['pens', 'school', 'student']],
  ['sticky-notes', 'office', 'Sticky Notes, 3" x 3", 24 Pads', 'Sticky Notes 24-pk', 14.99, '24 pads', 'in', 'home', ['school', 'student']],
  ['notebooks', 'office', 'Composition Notebooks, 6-Pack', 'Composition Notebooks', 8.99, '6 count', 'low', 'home', ['notebook', 'school', 'student']],
  ['markers', 'office', 'Permanent Markers, Assorted, 24-Pack', 'Markers 24-pk', 15.99, '24 count', 'in', 'home', ['markers', 'school']],
  ['reading-glasses', 'optical', 'Reading Glasses, 3-Pack (+1.50)', 'Readers 3-pk', 19.99, '3 pairs', 'in', 'other', ['glasses']],
  ['lens-wipes', 'optical', 'Pre-Moistened Lens Cleaning Wipes', 'Lens Wipes', 9.99, '210 count', 'in', 'other', ['glasses', 'wipes']],
];

const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const LEVEL_ORDER = [1, 2, 0]; // fill eye level, then pallet level, then top shelf

/** Build the merged demo catalog with mock inventory fields. */
function buildCatalog() {
  const out = DATA.products.map((p) => {
    const [name, short, stock] = CORE[p.id] || [p.name, p.name, 'in'];
    return { ...p, name, short, stock, browseOnly: false };
  });
  for (const [id, departmentId, name, short, demoPriceUsd, unitLabel, stock, kind, tags] of EXTRA) {
    out.push({ id, departmentId, name, short, demoPriceUsd, unitLabel, stock, kind, tags, isIllustrative: true, browseOnly: true });
  }
  const perDept = {};
  for (const p of out) {
    const i = (perDept[p.departmentId] = (perDept[p.departmentId] || 0) + 1) - 1;
    const h = hash(p.id);
    p.bay = i % 4;
    p.level = LEVEL_ORDER[Math.floor(i / 4)] ?? 0;
    p.itemNo = String(1000000 + (h % 899999));
    p.qtyOnHand = p.stock === 'out' ? 0 : p.stock === 'low' ? 2 + (h % 7) : 24 + (h % 150);
  }
  return out;
}

export const CATALOG = buildCatalog();

export const stockText = (p) => p.stock === 'out' ? 'Out of stock' : p.stock === 'low' ? `Low stock · ~${p.qtyOnHand} left` : `In stock · ~${p.qtyOnHand} on the floor`;
export const stockShort = (p) => p.stock === 'out' ? 'Out' : p.stock === 'low' ? 'Low' : 'In stock';
export const restockText = (p) => p.stock === 'out' ? 'Restock expected in 1–2 days' : p.stock === 'low' ? 'Pallet restock tonight' : '';

export function locationOf(p) {
  const a = AISLES[p.departmentId];
  const names = SLOT_NAMES[a.style] || SLOT_NAMES.rack;
  return { aisle: a.aisle, bay: names.bay(p.bay), level: names.level[p.level], text: `${a.aisle} · ${names.bay(p.bay)} · ${names.level[p.level]}` };
}
