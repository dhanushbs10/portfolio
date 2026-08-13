# Chapter 8, Polish Pass: SEO, Accessibility, Performance

**Goal of this chapter:** take the functionally-complete site from Chapters 0 to 7 and bring it up to the bar stated in the master plan, Lighthouse Performance ≥90, Accessibility ≥95, SEO ≥95 on `/` and `/homelab` specifically (the two most demanding pages), and genuine keyboard/screen-reader usability, not just an automated score.

**Prerequisites:** Chapters 0 to 7 complete. This is deliberately last (before deployment) so you're polishing a finished site, not chasing a moving target.

---

## 8.1 SEO

- `generateMetadata` audit across **every** route (home, homelab, projects index + all slugs, certifications, resume, blog/ctf/research index + all slugs, contact), title, description, canonical URL, all present and non-generic per page.
- OG images: a real per-page OG image strategy, either (a) one strong static default OG image for most pages plus custom ones for the home page and homelab page, or (b) dynamic OG image generation via `next/og` for project/blog/ctf/research slugs so each shares nicely on LinkedIn/Twitter with its own title. Recommend (b) for the content-type pages since you'll be adding many of them over time and don't want to hand-design an image per post.
- `sitemap.ts` and `robots.ts` in `/app` (Next.js native support), confirm all real routes are included, draft content-type posts excluded.
- Structured data (JSON-LD): `Person` schema on the home page, `Article` schema on blog/ctf/research posts, meaningful for how recruiters/search engines understand the site, low effort to add given the data already exists.
- Verify semantic HTML throughout: one `<h1>` per page, logical heading hierarchy (no skipped levels), `<nav>`/`<main>`/`<footer>` landmarks present.

## 8.2 Accessibility

- Full keyboard-only pass across the **entire site**, not just the motherboard scene (which already got dedicated attention in Chapter 5): tab order is logical, all interactive elements reachable and have visible focus states, no keyboard traps.
- Screen reader pass (VoiceOver/NVDA/Orca, Orca is available natively on your Kali/XFCE setup, which is convenient here) on: nav, the home page section-by-section scroll, the projects grid and detail page, the contact form, and the homelab reduced-motion fallback specifically (this is the version screen reader users will actually experience, so it needs real attention, not just "it exists").
- Color contrast audit against the design tokens from Chapter 0, check the accent/highlight colors specifically, since a single saturated accent color chosen for visual pop can sometimes fail contrast against the dark background at smaller text sizes.
- `alt` text audit on every image (screenshots, logos, hardware diagrams), descriptive, not filenames or "image1.png".
- Re-confirm `prefers-reduced-motion` behavior holds across every animated section site-wide, not just the ones built with it in mind from the start.

## 8.3 Performance

- Image optimization audit: every image via `next/image`, correct `sizes`/`priority` props (hero image and any above-the-fold images marked `priority`, everything else lazy).
- Code-splitting check: GSAP/ScrollTrigger and the motherboard scene components should be dynamically imported (`next/dynamic`) so their weight doesn't load on routes that don't need them (e.g. `/blog` shouldn't pull in GSAP).
- Font loading audit via `next/font`, confirm no layout shift from font swap, subset fonts if using a large family.
- Bundle analysis (`@next/bundle-analyzer`), identify and address any unexpectedly large client bundle, especially checking that server-only code (GitHub API calls, Resend) never leaks into a client bundle.
- Re-run the Chrome DevTools Performance panel scroll-jank check from Chapter 1 against the now-fully-loaded real site, particularly on `/homelab`.
- Lighthouse CI run (locally is fine, `npx lighthouse` or Chrome DevTools' own Lighthouse panel) against `/` and `/homelab` in an incognito window with no extensions interfering, recording real numbers against the ≥90/≥95/≥95 targets.

## 8.4 Cleanup

- Delete the `/dev/kitchen-sink` route from Chapter 0.
- Remove any remaining bracketed placeholder text anywhere in the site (final sweep).
- Confirm `.env.example` exists and is current (documents every required environment variable without real secret values), important since Chapter 9 is deployment and whoever sets up Vercel env vars needs this reference.

---

## Acceptance Criteria for Chapter 8

- [ ] Lighthouse (incognito, no extensions) on `/`: Performance ≥90, Accessibility ≥95, SEO ≥95.
- [ ] Lighthouse on `/homelab`: same thresholds.
- [ ] Full site navigable and usable keyboard-only, verified by actually doing it, not just checking `tabindex` values in code.
- [ ] Screen reader pass completed on the pages listed in 8.2 with no confusing/unlabeled interactive elements.
- [ ] No `/dev/*` routes or bracketed placeholder copy remain anywhere.
- [ ] `.env.example` is accurate and complete.

---

## Prompt to give Claude Code for this chapter

```
Read chapter-08-polish-pass.md and work through sections 8.1-8.4 in order.
Run real Lighthouse audits (incognito, no extensions) against / and /homelab
and report actual numbers, not estimates, iterate until the thresholds in
the Acceptance Criteria are met. Do a genuine keyboard-only pass and a screen
reader pass across the pages listed in 8.2 (Orca is available on this Kali/
XFCE machine) and fix whatever you find, not just what automated tooling
flags. Clean up per 8.4, including deleting /dev/kitchen-sink and producing
an accurate .env.example.

Report actual Lighthouse scores and a summary of what the manual
accessibility passes found and fixed, against the Acceptance Criteria.
```
