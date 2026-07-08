# Summit Plumbing Co. - Lead Engine Demo

A single-file, zero-config sales demo that shows a lead-capture automation system for home
service contractors: a realistic plumbing website on the left, the customer's iPhone on the
right, and five simulated automations connecting the two. Everything is visual simulation -
no SMS, no telephony, no backend, no build step.

## How to run

Open `index.html` in Chrome (or any modern browser). That's it.

```
open index.html        # macOS
start index.html       # Windows
```

Tips for a clean recording:

- Record at 1080p with the browser in **full-screen** (`F11` / `⌃⌘F`) so no tabs or bookmarks show.
- Press **P** to enter presentation mode (hides the control bar) and drive everything from the keyboard.
- Sound effects (iMessage-style send/receive pops) are on by default - press **S** to mute if you're doing a voiceover.
- Browsers only allow audio after your first click/keypress on the page, so click anywhere once before recording if you want sounds on the very first scenario.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `1` | Simulate Missed Call → text-back conversation |
| `2` | Simulate Form Submission (auto-fills and submits the website form, then the speed-to-lead text arrives) |
| `3` | Simulate Job Complete → review request text with the smart feedback link |
| `4` | Simulate After-Hours Call (11:47 PM) → AI answer → emergency dispatch |
| `5` | Reset demo (clears phone, stats, reviews, and form) |
| `V` | Flip the phone between Customer view (iMessage) and Owner view (GHL-style app) |
| `P` | Toggle presentation mode (hides/shows the control bar) |
| `S` | Toggle sound |
| `Esc` | Close the feedback page / exit presentation mode |

### The review gate (scenario 3)

Scenario 3 is interactive so you can show **both** outcomes:

1. Press `3` - the customer gets the "job's done" text with a tappable link.
2. Click the link in the bubble (it opens itself after 8 seconds if you don't) - the phone
   opens the customer's feedback page with a 5-star rating picker.
3. **While that page is open, keys `1`-`5` pick the star rating** (or click the stars):
   - **4-5 stars** → "Taking you to Google…" → Google review screen (stars fill, review
     auto-types, auto-posts) → the new review animates onto the website and the count ticks
     180 → 181.
   - **1-3 stars** → a normal-looking feedback form (the customer never learns it's gated -
     they just vent and feel heard). The complaint auto-types and sends, the customer sees
     "Thank you, Dan will call you" - and on the website side an **Owner Alert** card slides
     in: the low-star review was intercepted before it reached Google, with the full feedback
     forwarded to the owner. That card is the pitch: only you (the owner) know the filter exists.

For a live demo, run it twice: once with 5 stars, reset, then once with 2 stars. That
contrast - good reviews amplified, bad reviews caught - is the whole pitch.

### The owner view (press `V`)

The phone flips between two sides of the same system:

- **Customer's Phone**: the iMessage thread every scenario plays out on.
- **Owner's App**: a GHL-style mobile app showing what the business owner sees. Three
  working tabs, deliberately scoped to the offer (no CRM, no payments):
  - **Conversations**: every lead thread. Tap a conversation to open the business side of
    it: customer messages on the left, the system's replies on the right, each tagged
    "AI · auto-replied", with a "Reply as Summit Plumbing to take over" composer. If a
    scenario is running while the thread is open, new messages appear live.
  - **Reviews**: every review that came through the engine, with a status chip: green
    "On Google" for 4-5 stars, amber "Private · Call back" for intercepted 1-3 stars.
  - **Bookings**: every job the automations booked, including the after-hours emergency.

  Every automation fires an owner push notification in real time: "Missed call rescued",
  "New lead: Sarah Mitchell", "Job booked: tomorrow 8am", "New 5-star Google review",
  "EMERGENCY: burst pipe, tech dispatched".

While you're on the customer view, owner events stack a red unread badge on the
**Owner's App** toggle. That's a deliberate beat for the demo: run a scenario on the
customer side, then flip with `V` and say *"and this is what was happening on YOUR phone
the whole time."* Reset (`5`) clears the inbox back to its seed conversations.

You can also fill out the **Request Service** form by hand - submitting it triggers the
speed-to-lead text using whatever name and issue you typed. Shortcut keys are ignored while
you're typing in the form, so type freely.

## Suggested demo script (maximum-impact order)

1. **Open on the website.** Scroll it slowly - let the prospect want the site itself. Point out
   the 4.9★ / 180 reviews and the 24/7 badge.
2. **Show the SEO pages.** Hover **Services** and **Locations** in the nav: ten dedicated
   pages each. Click a city (say, Littleton) and watch the URL change to
   `summitplumbingco.com/plumber-littleton-co` with its own headline and page title. The
   line: *"That's 20 pages of Google real estate. When someone in Littleton searches
   'plumber near me', one of these pages is what ranks."* Click Home or the logo to go back.
3. **`2` - Form Submission (the money shot).** The form fills itself and submits; ~5 seconds
   later the customer's phone lights up with a personalized text pulling the actual form values.
   Narrate: *"Your competitor calls back tomorrow. You texted back in five seconds."*
4. **`1` - Missed Call.** Customer calls, nobody answers... and 47 seconds later the system
   texts back, qualifies the issue, and locks in a 2:30 callback with the lead tech. No
   sight-unseen commitments, just a captured lead with a time on the calendar. Watch the
   stats card bump.
5. **`4` - After-Hours.** 11:47 PM, pipe burst. The AI answers, dispatches emergency service,
   and even tells the customer to shut off the water main. This is the "you were asleep and
   still made $850" moment.
6. **`3` - Job Complete (review gate).** Review request hits the customer's phone. Click the
   link, tap **5 stars** → customer lands on Google, the review posts, and it slides onto the
   website as the count ticks 180 → 181. Then reset, run it again, and tap **2 stars** →
   the complaint goes privately to the owner and never touches Google. Good reviews amplified,
   bad reviews intercepted - the system feeds itself and protects itself.
7. **`V` - Flip to the owner's app.** After a scenario or two, the Owner's App toggle is
   wearing a red badge. Flip it: the GHL-style inbox shows every lead, booking, and review
   that just happened, with push notifications. The line: *"You didn't touch anything.
   Here's everything the system handled, sitting in your pocket."* Flip back with `V`.
8. **Point at the stats card** (above the phone): Missed Calls Rescued, Jobs Booked,
   Revenue Saved - all of it climbed live during the demo. That's the monthly money report.
9. **`5` - Reset** and you're ready to run it again.

## Job photos in the gallery

The "Recent jobs" gallery ships with six embedded photos in the `photos/` folder, wired up
in `const JOB_PHOTOS` near the top of the script in `index.html`. To swap any tile for a
different photo, drop the new file in `photos/` and change that entry's path:

```js
const JOB_PHOTOS = [
  "photos/water-heater.jpg",   // 50-gal water heater swap
  "photos/repipe.jpg",         // Copper-to-PEX repipe
  ...
];
```

Landscape photos around 1200px wide look best; they're cropped to a 4:3 tile
automatically. Set an entry to `null` to show a styled placeholder tile instead, and if a
photo ever fails to load the tile falls back to the placeholder rather than a broken
image. The captions live in the HTML right below each card if you want to change
neighborhoods or job types.

## Personalized prospect demos (builder.html)

Open `builder.html` (locally or at /builder.html on the hosted URL), fill in a prospect
from your list (business name, phone, trade, city, nearby cities, Google rating and
review count), and click **Open personalized demo**. The whole demo rebrands itself:
name, phone, avatars, services, scenario conversations, city SEO pages, reviews, and
stats, using a trade preset (plumbing, HVAC, electrical, roofing, handyman).

The config lives in the link itself (`index.html#cfg=...`), so every link is permanent
and shareable with the prospect, and nothing needs to be rebuilt or redeployed. Gallery
photos switch to styled tiles for non-plumbing trades. Record the video from that link,
send the same link in your outreach.

## Rolling this out for real clients

The `template/` folder contains a config-driven static site generator that turns this
demo's website into a real deliverable: one config file per client, one command, and it
builds a complete multi-page SEO site (home + a real page per service + a real page per
city + sitemap) ready to deploy on Vercel or Netlify, with the lead form posting to any
webhook (GHL or otherwise). See `template/README.md`.

## What's simulated

Every automation is timed, scripted animation: the outgoing call screen, the "No Answer,"
the typing indicators, the customer's replies (auto-typed into the compose bar), the
notification banners, read receipts, the new review card, and the live stats counters.
Timing gaps are intentionally human (1-3 seconds) so it reads as real on camera.
