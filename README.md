# Juyal Realtors — website

A static, no-build website for **Juyal Realtors** (UP RERA `UPRERAAGT11026`), Sector 18, Noida.
Plain HTML, CSS and vanilla JS — no framework, no server, no database. Open `index.html` and it runs.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, RERA trust strip, four practices, YEIDA band, why-us, ratings, micro-markets, office + map |
| `yeida.html` | YEIDA / Yamuna Expressway hub — sector breakdown, catalysts, authority-plot buyer checklist, plot enquiry form |
| `properties.html` | Featured mandates — filterable cards (plots / residential / commercial) + inventory enquiry form |
| `about.html` | The firm, Yogesh Juyal, timeline 2005 → 2026, commitments, public ratings |
| `contact.html` | Consultation form, full office details, hours, map, FAQs |
| `assets/css/site.css` | The whole design system (colours, type, components) |
| `assets/js/site.js` | Nav, scroll reveal, mandate filters, forms → WhatsApp |
| `assets/js/listings.js` | **The content file you will edit most** — the property cards |

---

## How the forms work

There is no backend. Every form builds a pre-written WhatsApp message and opens
`wa.me/919810328027`. Nothing is submitted to, or stored on, the website — which also means
no privacy or data-retention obligations from the site itself.

If you later want enquiries by email instead, the single place to change is the
`openWhatsApp()` helper at the top of `assets/js/site.js`.

**The phone number lives in one place**: `WA_NUMBER` at the top of `assets/js/site.js`
(for forms and mandate buttons). The `tel:` and `wa.me` links written directly into the HTML
also need updating if the number ever changes — search for `9810328027` across all files.

---

## The office map

The markup ships a styled address card with an **Open in Google Maps** button, which works
everywhere. On load, `site.js` tries to upgrade it to a live embedded Google map and silently
falls back to the card if the embed is blocked (some preview hosts refuse third-party frames).
On your own hosting, and on GitHub Pages, the live map appears automatically — nothing to
configure.

---

## Editing property mandates (no coding)

Open `assets/js/listings.js`. Each block between `{` and `}` is one card:

```js
{
  ref: "JR-Y-101",
  category: "plot",              // plot | residential | commercial  -> drives the filter chips
  tag: "YEIDA Authority",        // small label, top-right of the card
  title: "Residential plot, YEIDA Sector 18",
  location: "Yamuna Expressway, Gautam Budh Nagar",
  specs: [
    ["Plot area", "120 sq m"],
    ["Facing", "Park facing"],
    ["Status", "Allotment, transferable"]
  ],
  price: "Price on request"
},
```

Add, remove or reorder blocks freely. Keep the commas between blocks and the quotes around text.
Use `&amp;` where you want an `&`, and `&ndash;` for an en dash.

---

## Before this goes live — a checklist

1. **Replace the sample mandates.** The nine entries in `listings.js` are *representative* of the
   categories the firm handles, not live inventory. Swap in real ones (or cut the list down).
2. **Replace the review cards with real reviews.** On `index.html`, the three `.quote` blocks
   currently summarise *themes* from public reviews rather than quoting named clients. Paste
   verbatim reviews with real names only where you have the client's consent. The dashed
   "Note for the site owner" boxes on `index.html`, `properties.html` and `about.html` are
   instructions to you — **delete all three before publishing**.
3. **Refresh the ratings.** `4.9 / 59 reviews` (Google), `4.5 / 84 ratings` (Justdial) and
   `4.3` (RealEstateIndia) were accurate when this was written. Update them, and consider
   linking each card to the live profile.
4. **Check the corporate reference.** The NSB BPO Solutions Limited mandate (August 2024) is cited
   on `about.html` and `index.html` from BSE filings. Confirm you are comfortable naming the client
   publicly before launch.
5. **Set the real domain.** Every page has `<link rel="canonical">` and `og:` tags pointing at
   `https://www.juyalrealtors.com/`. Search and replace with the actual domain.
6. **Add a social share image.** Add `og:image` + `twitter:card` tags once you have a 1200×630
   image (office exterior or a branded card works well).
7. **Google Business Profile.** Add the website URL to the profile — it is the firm's strongest
   existing digital asset and should point here.
8. **Analytics / pixel.** None is installed. Drop your snippet just before `</body>` on each page
   if you want one.
9. **Verify the office address format.** The brief lists both "Chokhani Towers" and
   "Chokhani Square, P-4" — both are shown on `contact.html`. Trim to whichever is correct on
   the signage.

---

## Publishing on GitHub Pages

No build step, no Node, no environment variables — just upload the files.

1. On GitHub, click **New repository**. Name it something like `juyal-realtors`.
   Leave "Add a README" **unticked** so the repo starts empty.
2. On the empty repo page, click **uploading an existing file**.
3. Open this folder, select **everything inside it** — `index.html`, `yeida.html`,
   `properties.html`, `about.html`, `contact.html`, `README.md` and the `assets` folder —
   and drag that selection onto the page.
   **Do not drag the folder itself**, or every file lands one level too deep and the site
   will not load.
4. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Build and deployment*, set **Source** to
   *Deploy from a branch*, **Branch** to `main` and the folder to `/ (root)`. Click **Save**.
6. Wait about a minute, then reload the Settings → Pages screen. It will show the live URL,
   in the form `https://<your-username>.github.io/juyal-realtors/`. That is the link to send.

Two things worth knowing:

- On a **free** GitHub plan, Pages only works from a **public** repository, so the source and
  this README are readable by anyone with the link. Nothing sensitive is in here, but delete
  `README.md` before uploading if you would rather the client not read the build checklist.
- Pages serves the site from a sub-path (`/juyal-realtors/`). Every link, stylesheet and script
  in this site is relative, so it works correctly from a sub-path or from a domain root —
  no changes needed when you later move it to `juyalrealtors.com`.

### Other hosts

- **Netlify / Vercel / Cloudflare Pages** — drag this folder in, or connect the repo.
- **Shared hosting / cPanel** — upload the contents of this folder into `public_html`.

### Local preview

```bash
python -m http.server 5173
```

then open `http://localhost:5173`. (Opening `index.html` directly also works; a local server just
makes the Google Maps embed behave exactly as it will in production.)

---

## Design notes

- **Palette:** deep navy `#0A1829` / `#112B45`, brass `#B4832A` / `#C9A14A`, warm white `#FCFAF6`.
- **Type:** Playfair Display (headings), Inter (body), IBM Plex Mono (RERA ID, figures, labels).
  All three load from Google Fonts.
- **Responsive** down to 320px; mobile nav drawer below 980px.
- **Accessibility:** skip link, semantic landmarks, visible focus rings, `prefers-reduced-motion`
  respected, forms fully labelled. Content is readable with JavaScript disabled on every page
  except the mandate grid, which shows a `<noscript>` fallback with the phone number.
- **SEO:** per-page titles and descriptions, canonical URLs, Open Graph tags, and
  `RealEstateAgent` JSON-LD structured data on the home page (address, hours, RERA identifier).
  Review markup is deliberately omitted — Google does not allow self-serving review snippets
  for a business's own site.

---

## Accuracy note

All factual content (RERA number, founding year, address, hours, phone, ratings, the NSB BPO
mandate, projects handled) comes from the research brief supplied for this build. Nothing was
invented to fill space: no deal counts, no fabricated client quotes, no fake inventory prices.
Anything that could not be verified is either marked as representative or left out. Please
re-check every figure against your own records before publishing.
