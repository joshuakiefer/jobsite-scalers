# Client Site Template

A config-driven static site generator for rolling out contractor websites. One config
file defines the whole business; one command builds a complete multi-page SEO site:

- Home page (hero + lead form, services grid, job gallery, reviews, service areas)
- A real, indexable page for every service (up to 10) at `/water-heater-repair/`
- A real, indexable page for every city (up to 10) at `/plumber-littleton-co/`
- `sitemap.xml`, `robots.txt`, canonical URLs, and LocalBusiness structured data

No frameworks, no dependencies, no build tooling to maintain. Plain Node.

## New client in four steps

1. **Copy the config.** Duplicate `site.config.js` (e.g. `clients/acme-hvac.config.js`)
   and fill it in: business info, trade wording, brand colors, services, cities,
   reviews, gallery photos, and form copy. The `trade` block makes it work for any
   trade: `{ noun: "heating & cooling", person: "HVAC contractor", urlPrefix: "hvac" }`.

2. **Point the form at the backend.** Set `leadWebhook` to a GHL inbound-webhook URL
   (Automation → Workflows → Inbound Webhook), or a Zapier/Make hook, or anything that
   accepts a JSON POST. Payload: `{ name, phone, address, issue, page, source,
   submittedAt }`. Leave it `""` while testing; the form still shows its success state.

3. **Build.**
   ```
   node generate.js clients/acme-hvac.config.js
   ```
   Output lands in a `dist/` folder next to the config: 21 pages for a full config.

4. **Deploy.** Point Vercel or Netlify at the `dist/` folder (drag-and-drop works on
   Netlify; on Vercel set the project's output directory to `dist`). Add the client's
   domain. Done.

## Previewing locally

`dist/index.html` opens fine by double-clicking, but the pretty URLs (`/drain-cleaning/`)
need a web server to resolve, so preview with any static server:

```
npx serve dist
```

Then open the printed localhost URL. (On Vercel/Netlify this is automatic.)

## Photos

Gallery entries reference image files by relative path; the generator copies them into
`dist/photos/`. Landscape, ~1200px wide, they crop to 4:3 tiles. Swap in each client's
real job photos; the captions come from the config.

## What this pairs with

This template is the front end. The automations in the demo (missed-call text-back,
speed-to-lead, review gating, after-hours AI, the owner's mobile app) are the backend,
and the form's webhook is the handoff point between the two. The site works with GHL,
with any other automation platform, or standalone; nothing in it is GHL-specific.
