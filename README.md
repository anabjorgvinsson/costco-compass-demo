# Costco Compass — Student Concept Demo

A working, phone-first beta for the Vanderbilt BUSA 2205 Board presentation.
**Student concept prototype · all member data and prices are fictional.** Not affiliated with or endorsed by Costco Wholesale. No sign-up, no payment, no real account, no health data, no AI API key.

## What's inside

| Route | What it shows |
|---|---|
| `#/` | QR landing page: "Experience Costco Compass" plus Sarah / Jake / Maya cards |
| `?persona=sarah` (or `jake` / `maya`) | Deep link straight into one member's Compass home |
| `#/member/sarah` (or `jake` / `maya`) | Desktop personalized homepage (for the projector) |
| `#/compass/<member>` + `/chat`, `/list`, `/map`, `/summary` | The mobile Compass app |

On GitHub Pages, `/member/sarah` and `/compass/jake/map` style paths also work; `404.html` forwards them.

- **Data:** `docs/Costco_Compass_Demo_Data.json` is the source of truth; `js/data.js` is generated from it. Integrity checks run in the browser console at startup (`[Compass] Fixture integrity OK`).
- **Mock inventory:** `js/inventory.js` holds specific product names, demo item numbers, aisle/bay/shelf placement and stock levels for ~100 items, plus browse-only extras. `js/details.js` holds illustrative nutrition facts, highlights and goal checks. All of it is made up for the demo — edit freely.
- **Chat:** `js/chat.js` is deterministic and keyword-aware (no network). `docs/openai-adapter.example.mjs` is an optional server-side sketch; it is off by default and not deployed.
- **Map and routing:** `js/route.js` builds a corridor graph from the fixture nodes, finds shortest paths, and picks the best stop order, Entrance → stops → Checkout.

## Run it locally

No install needed (Python 3 ships with macOS):

```bash
cd costco-compass && python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy to GitHub Pages (personal account, separate from any org)

```bash
cd costco-compass
git init -b main && git add . && git commit -m "Costco Compass student demo"
gh repo create costco-compass-demo --public --source=. --push
gh api -X POST repos/{owner}/costco-compass-demo/pages -f "source[branch]=main" -f "source[path]=/"
```

The site appears at `https://<your-username>.github.io/costco-compass-demo/` after about a minute.

## QR codes (only after the public URL works)

Open the live URL on your laptop and phone first. Then generate the codes in a throwaway virtual environment:

```bash
python3 -m venv /tmp/qrenv && /tmp/qrenv/bin/pip install "qrcode[pil]"
/tmp/qrenv/bin/qr "https://<your-username>.github.io/costco-compass-demo/" > compass-qr.png
```

Backup persona codes: append `?persona=sarah`, `?persona=jake` or `?persona=maya`.

## 90-second audience path

Scan → **Shop as …** → tap a gold prompt chip → **Map my trip** → toggle **Quick Trip / Treasure Hunt** → tap a numbered stop → check an item → **Switch member**.

## Backup plan

Before class, record a 30–60 s screen capture of one journey and screenshot all three maps (Sarah, Jake, Maya) in case the Wi-Fi fails.
