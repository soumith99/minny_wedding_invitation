# Wedding Invitation Website

A mobile-first, scroll-driven wedding invitation that alternates between **Traditional South Indian** and **Modern Global** visual themes.

## Quick start

Open `index.html` in a browser, or serve locally:

```bash
cd /Users/soumith/wedding-invitation
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Customize

### Names & family details

Edit `index.html` — search for `Ananya`, `Arjun`, and the family-tree paragraphs.

### Event dates, times, venues, maps

Update each event card’s `<dd>` values and `btn-maps` `href` Google Maps links.

### Background photos

Replace `--bg-image` URLs on `.section-bg`, `.event-bg`, and `.footer-bg`, or swap the Unsplash URLs in `css/styles.css` intro `::before` backgrounds.

### Ambient music

1. Add `audio/ambient-fusion.mp3` (lo-fi guitar + veena/flute works well).
2. In `js/main.js`, set `AUDIO_URL` if you use a different path.

### RSVP

- **Email:** default opens `mailto:rsvp@example.com` — change in `js/main.js`.
- **Google Form:** set `RSVP_SUBMIT_URL` and map `FormData` field names to your form entries.

## Features

- Scroll-driven theme morphing (ivory → twilight → marigold)
- Intro panels slide in from right (groom) / left (bride)
- Sticky dot nav: PK → Haldi → Wed → Vratham → Sangeet → Rec
- Per-event themed cards with photo backgrounds
- Fixed thumb-friendly RSVP button
- Lightweight SVG motifs (no heavy video)
- `prefers-reduced-motion` support

## Deploy

Upload the folder to Netlify, Vercel, GitHub Pages, or any static host. No build step required.
