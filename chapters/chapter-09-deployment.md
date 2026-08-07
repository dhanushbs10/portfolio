# Chapter 9 — Deployment & Launch

**Goal of this chapter:** get the finished, polished site live on a real domain with correct environment configuration, then confirm production actually works end-to-end (not just "the build succeeded").

**Prerequisites:** Chapters 0–8 complete. This is the final chapter.

---

## 9.1 Pre-Deploy Checklist

- Run a full local production build (`next build && next start`) and click through the entire site against that build, not just `next dev` — some issues (env var handling, dynamic imports, static generation edge cases) only surface in a production build.
- Confirm `.env.example` (from Chapter 8) lists every variable the app needs: `RESEND_API_KEY`, `CONTACT_DESTINATION_EMAIL`, `GITHUB_TOKEN`, plus any DB connection string if you've since migrated off local JSON data.
- Confirm `.env.local` (real values) is git-ignored and was never committed at any point in history — do a quick `git log -p -- .env.local` style check if there's any doubt.

## 9.2 Vercel Setup

- Connect the GitHub repo to a new Vercel project.
- Set all environment variables from `.env.example` in the Vercel project settings (Production + Preview environments — Preview is genuinely useful here since you'll likely keep adding chapters/content after "launch" and want PR previews to work correctly).
- Confirm the build command and output settings are Next.js defaults (Vercel auto-detects, but verify rather than assume).
- Trigger the first deploy and check the build log for any warnings that were silent locally.

## 9.3 Domain & DNS

- If using a custom domain: add it in Vercel, configure DNS (A/CNAME records at your registrar) per Vercel's instructions, wait for propagation, confirm HTTPS certificate issues automatically.
- If not using a custom domain yet: confirm the `vercel.app` URL works fully and note that OG/metadata URLs (from Chapter 8) should still be correct relative URLs so switching domains later doesn't require re-touching metadata code.

## 9.4 Post-Deploy Verification (do this against the live production URL, not localhost)

- [ ] Full click-through of every route on production.
- [ ] Submit the contact form for real on production and confirm the email arrives.
- [ ] Confirm GitHub stats badges show live data on production (this exercises the real server-side fetch + your real token in the real environment for the first time).
- [ ] Re-run Lighthouse against the **production** URL for `/` and `/homelab` — production numbers can differ from local dev numbers due to edge caching, real CDN latency, etc.
- [ ] Confirm `sitemap.xml` and `robots.txt` resolve correctly on production.
- [ ] Share a project or blog post link on a platform that generates link previews (or use a social preview debugger) to confirm OG images render correctly in the wild.
- [ ] Mobile device check on a real phone, not just devtools' responsive mode, if possible.

## 9.5 Analytics (optional but recommended)

- Vercel Analytics or a privacy-respecting alternative (Plausible, etc.) — enough to know if anyone's actually visiting once you start sharing the link with recruiters, without needing invasive tracking for a personal portfolio.

## 9.6 Ongoing Maintenance Note

This isn't a "chapter" task, but worth stating explicitly now that the site is live: your content systems (Projects, Blog, CTF, Research, Certifications, Roadmap) were all built in earlier chapters specifically so that ongoing updates are additive (new MDX files, new data entries) rather than requiring you to reopen Claude Code for structural changes. Treat any future request that *does* require touching layout/component code as a signal worth double-checking against the original scalability goal before proceeding.

---

## Acceptance Criteria for Chapter 9

- [ ] Site is live on its final URL (custom domain or `vercel.app`) with valid HTTPS.
- [ ] Every item in 9.4's post-deploy verification checklist passes against production, not staging or localhost.
- [ ] Contact form delivers real email from production.
- [ ] Production Lighthouse numbers meet or exceed the Chapter 8 targets.

---

## Prompt to give Claude Code for this chapter

```
Read chapter-09-deployment.md and work through it. First run a full local
production build (next build && next start) and click through the whole
site against it. Then help me connect the repo to Vercel, set up the
environment variables listed in .env.example in both Production and Preview,
and trigger the first deploy.

Once live, work through the Post-Deploy Verification checklist in 9.4 against
the real production URL — including actually submitting the contact form and
confirming the email arrives, and re-running Lighthouse against production.
Report against the Acceptance Criteria, and flag anything that passed locally
but behaves differently in production.
```
