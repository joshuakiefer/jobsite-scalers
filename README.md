# Summit Plumbing Co. — Lead Engine Demo

A single-file, zero-config sales demo that shows a lead-capture automation system for home
service contractors: a realistic plumbing website on the left, the customer's iPhone on the
right, and five simulated automations connecting the two. Everything is visual simulation —
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
- Sound effects (iMessage-style send/receive pops) are on by default — press **S** to mute if you're doing a voiceover.
- Browsers only allow audio after your first click/keypress on the page, so click anywhere once before recording if you want sounds on the very first scenario.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `1` | Simulate Missed Call → text-back conversation |
| `2` | Simulate Form Submission (auto-fills and submits the website form, then the speed-to-lead text arrives) |
| `3` | Simulate Job Complete → review request text with the smart feedback link |
| `4` | Simulate After-Hours Call (11:47 PM) → AI answer → emergency dispatch |
| `5` | Reset demo (clears phone, stats, reviews, and form) |
| `P` | Toggle presentation mode (hides/shows the control bar) |
| `S` | Toggle sound |
| `Esc` | Close the feedback page / exit presentation mode |

### The review gate (scenario 3)

Scenario 3 is interactive so you can show **both** outcomes:

1. Press `3` — the customer gets the "job's done" text with a tappable link.
2. Click the link in the bubble (it opens itself after 8 seconds if you don't) — the phone
   opens the customer's feedback page with a 5-star rating picker.
3. **While that page is open, keys `1`–`5` pick the star rating** (or click the stars):
   - **4–5 stars** → "Taking you to Google…" → Google review screen (stars fill, review
     auto-types, auto-posts) → the new review animates onto the website and the count ticks
     180 → 181.
   - **1–3 stars** → private feedback page ("Private — never published") → complaint
     auto-types and sends to the owner → confirmation that nothing was posted publicly,
     plus an on-screen note that the bad review was intercepted.

For a live demo, run it twice: once with 5 stars, reset, then once with 2 stars. That
contrast — good reviews amplified, bad reviews caught — is the whole pitch.

You can also fill out the **Request Service** form by hand — submitting it triggers the
speed-to-lead text using whatever name and issue you typed. Shortcut keys are ignored while
you're typing in the form, so type freely.

## Suggested demo script (maximum-impact order)

1. **Open on the website.** Scroll it slowly — let the prospect want the site itself. Point out
   the 4.9★ / 180 reviews and the 24/7 badge.
2. **`2` — Form Submission (the money shot).** The form fills itself and submits; ~5 seconds
   later the customer's phone lights up with a personalized text pulling the actual form values.
   Narrate: *"Your competitor calls back tomorrow. You texted back in five seconds."*
3. **`1` — Missed Call.** Customer calls, nobody answers... and 47 seconds later the system
   texts back, holds the conversation, and books the job for 2–4pm. Watch the stats card bump.
4. **`4` — After-Hours.** 11:47 PM, pipe burst. The AI answers, dispatches emergency service,
   and even tells the customer to shut off the water main. This is the "you were asleep and
   still made $850" moment.
5. **`3` — Job Complete (review gate).** Review request hits the customer's phone. Click the
   link, tap **5 stars** → customer lands on Google, the review posts, and it slides onto the
   website as the count ticks 180 → 181. Then reset, run it again, and tap **2 stars** →
   the complaint goes privately to the owner and never touches Google. Good reviews amplified,
   bad reviews intercepted — the system feeds itself and protects itself.
6. **Point at the stats card** (top-right of the website): Missed Calls Rescued, Jobs Booked,
   Revenue Saved — all of it climbed live during the demo. That's the monthly money report.
7. **`5` — Reset** and you're ready to run it again.

## What's simulated

Every automation is timed, scripted animation: the outgoing call screen, the "No Answer,"
the typing indicators, the customer's replies (auto-typed into the compose bar), the
notification banners, read receipts, the new review card, and the live stats counters.
Timing gaps are intentionally human (1–3 seconds) so it reads as real on camera.
