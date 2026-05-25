# Soumith & Malathi — Wedding Invitation

A mobile-first, scroll-driven wedding invitation that blends **Traditional South Indian** and **Modern Global** visuals — ivory invocation, twilight groom intro, marigold bride intro, and per-event celebration cards.

Share different links for general guests vs. closer family, and for groom-side vs. bride-side invites.

## Quick start

Open `index.html` in a browser, or serve locally (recommended so audio and assets load reliably):

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080)

No build step or dependencies.

## Invite links (query params)

The page reads URL parameters **before paint** (`js/invite.js` + `js/invite-config.js`) and sets `data-invite-tier` / `data-invite-version` on `<html>`. CSS hides the rest — no build step.

| Param | Values | Default |
|-------|--------|---------|
| `version` | `groom`, `bride` | `groom` |
| `key` | Full-invite secret (see below) | *(none → minimal)* |

### Tiers

**Minimal** (default, or any URL without a valid `key`):

- Invocation, **both** groom and bride intro panels, footer
- Events: **The Wedding Day** and **Reception** only

**Full** (valid `key` — for closer guests):

- Same intros as minimal
- `version=groom` → groom-side Pelli Koduku / Haldi / Vratham (Khammam); `version=bride` → Pelli **Kuthuru** and Haldi at **our residence, Ongole**, Vratham at **Varadaiah Nagar, Khammam**; wedding, Sangeet, reception unchanged

### Example URLs

```text
/                                    → minimal, groom side
?version=bride                       → minimal, bride side
?version=groom&key=d4e8b2a7f1c9      → full groom schedule
?version=bride&key=d4e8b2a7f1c9      → full bride schedule
```

### Change the secret key

Edit `fullAccessKey` in `js/invite-config.js` before you deploy or text links. Anyone with the key sees the full calendar; keep it out of public posts and use minimal links for wider sharing.

## Project structure

```
├── index.html          # Content, events, markup
├── css/styles.css      # Themes, layouts, invite visibility rules
├── js/
│   ├── invite-config.js  # Full-invite secret key
│   ├── invite.js         # URL → data-invite-* on <html>
│   └── main.js           # Scroll themes, reveals, audio, RSVP
├── assets/             # Local photos (Ganesha, events, temple)
│   ├── ganesha.jpg
│   ├── elephant.avif
│   ├── kalyanam.jpg
│   ├── sangeet.jpg
│   ├── sunset.jpg
│   ├── temple.avif
│   └── vratham.jpg
└── audio/
    └── Kaanunna Kalyanam.mp3
```

## Celebrations schedule

### Always shown (minimal + full)

| Event | Date | Time | Venue |
|-------|------|------|-------|
| The Wedding Day (Muhurtham) | Wednesday, 24 June 2026 | 8:55 PM | Brindavanam Kalyana Vedika, Ongole |
| Reception | Friday, 26 June 2026 | 7:00 PM onwards | SR Gardens, Khammam |

### Full invite — groom (`version=groom` + valid `key`)

| Event | Date | Time | Venue |
|-------|------|------|-------|
| Pelli Koduku | Sunday, 21 June 2026 | 10:00 AM | Our residence, Varadaiah Nagar, Khammam |
| Haldi | Tuesday, 23 June 2026 | 10:00 AM | Our residence, Varadaiah Nagar, Khammam |
| Vratham | Thursday, 25 June 2026 | 4:00 PM onwards | Our residence, Varadaiah Nagar, Khammam |
| Sangeet | Thursday, 25 June 2026 | 8:00 PM onwards | RR Gardens, Khammam |

### Full invite — bride (`version=bride` + valid `key`)

| Event | Date | Time | Venue |
|-------|------|------|-------|
| Pelli Kuthuru | Sunday, 21 June 2026 | 10:00 AM | Our residence, Ongole |
| Haldi | Tuesday, 23 June 2026 | 10:00 AM | Our residence, Ongole |
| Vratham | Thursday, 25 June 2026 | 4:00 PM onwards | Varadaiah Nagar, Khammam |
| Sangeet, Wedding, Reception | Same as groom full | | |

Map links live on each event card in `index.html` (`btn-maps` `href` values). Bride-side PK and Haldi use the [Ongole residence map](https://maps.app.goo.gl/Z7aHYGRwFtwGzHtx5?g_st=aw).

## Customize

### Names & family details

Edit `index.html` — couple names in the invocation header, full names and family lines under **The Groom** / **The Bride**, and footer sign-off.

### Event dates, times, venues, maps

Update each event card’s `<dd>` values and the `btn-maps` Google Maps links in `index.html`. For bride-only copy, edit the `data-invite-variant="bride"` blocks inside Pelli Kuthuru and Haldi cards.

### Photos & backgrounds

| Location | What to change |
|----------|----------------|
| `assets/ganesha.jpg` | Lord Ganesha image on the invocation |
| `css/styles.css` | Event card backgrounds (`event-card--pk`, `--haldi`, etc. use `assets/`) |
| `css/styles.css` | Bride intro uses `assets/temple.avif`; groom intro uses an Unsplash URL on `.intro-panel--modern::before` |
| `index.html` | Invocation overlay (`--bg-image` on `.section-bg`) and reception card (`--bg-image` on `.event-bg`) |

Replace files in `assets/` or point URLs to new images.

### Ambient music

1. Add or replace `audio/Kaanunna Kalyanam.mp3` (or another track).
2. Update the `<source src="...">` on the `#ambientAudio` element in `index.html`.
3. Optional: change `AUDIO_START_SEC` in `js/main.js` (default `16`) so playback skips the intro of the track.

### RSVP

The modal markup and form logic are in place; the fixed **RSVP** button is commented out in `index.html`. To enable it, uncomment:

```html
<button type="button" class="rsvp-fixed" id="rsvpBtn">RSVP</button>
```

Then configure `js/main.js`:

- **Google Form:** set `RSVP_SUBMIT_URL` and align `FormData` field names with your form entries.
- **Email fallback:** when `RSVP_SUBMIT_URL` is empty, submit opens `mailto:rsvp@example.com` — change that address in the `mailto` string.

### Event dot navigation (optional)

Styles and JS support a sticky dot nav (`#eventDots` with `data-target` buttons). It is not included in `index.html` right now; if you add it, `main.js` only wires dots for events visible in the current invite tier.

## Features

- URL-driven **minimal** vs **full** invites (`version` + secret `key`)
- Scroll-driven global theme morph (ivory → twilight → marigold → events)
- Invocation with Telugu mantra (Noto Serif Telugu) and local Ganesha photo
- Groom / bride intro panels with slide-in reveals and cross-fade on scroll (full tier)
- Themed event cards with local photo backgrounds and map links
- Fixed ambient-music toggle (loops from 16s into the track)
- RSVP dialog (optional fixed trigger)
- `prefers-reduced-motion` support

## Deploy

Upload the project folder to Netlify, Vercel, GitHub Pages, or any static host. Include `assets/` and `audio/` in the deploy. No build step required.

When sharing links, append query strings as needed (`?version=bride`, `?key=…`). Relative paths work on any static host.
