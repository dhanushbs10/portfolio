# Chapter 6, Remaining Content Systems

**Goal of this chapter:** build out every content route that isn't Projects or Home Lab, the full Certifications page, the Resume page, and the scaffolding (routes + listing pages + one seed post each) for the future Blog, CTF Writeups, and Research Notes sections. By the end of this chapter, every nav link resolves to a real, finished page, nothing left showing a "under construction" stub from Chapter 0.

**Prerequisites:** Chapters 0 to 3 complete. (Chapters 4 and 5 don't need to be done first, but doing them first means you can reuse patterns, e.g. the MDX pipeline from Chapter 4 gets reused wholesale here.)

---

## 6.1 Full Certifications Page

- `/certifications/page.tsx`, grid of every certification from `getCertifications()` (Chapter 2 data), not just the home page preview subset.
- Filter/sort controls: by status (earned/in-progress/planned) and by issuer, simple client-side filtering, same pattern as the Projects filter in Chapter 4.
- Each card: logo, name, issuer, status badge (reuse the status badge styling established in Chapter 1/3's preview), date earned if applicable, "Verify credential →" link if `credentialUrl` exists.
- Empty/thin states handled honestly (e.g. a clearly-labeled "planned" section for certs you haven't started, distinct from "in-progress").

## 6.2 Resume Page

- `/resume/page.tsx`, a styled, readable, on-brand rendering of your resume as an actual page (not just a PDF embed), reuse design tokens from Chapter 0 so it feels like part of the site, not a dropped-in document.
- Prominent "Download PDF" button. Two implementation options, pick one:
  - (a) Maintain a real PDF in `/public/resume.pdf`, simplest and most reliable, recommended as the default.
  - (b) Generate the PDF from the same structured resume data using `@react-pdf/renderer` at build time, more "impressive" engineering but real added complexity for marginal benefit; only do this if you specifically want to demonstrate that skill.
- Resume content should be structured data (`/data/resume.ts` typed against a `ResumeEntry`-style shape) so the on-page version and the PDF (if going with option b) share one source, rather than maintaining two documents that can drift out of sync.

## 6.3 Blog / CTF Writeups / Research Notes, Shared Content Engine

These three sections are intentionally built on **one shared system**, parameterized by content type, not three separate ones.

- Extend `/lib/mdx.ts` (built in Chapter 4 for Projects) to be generic across content folders: `getAllContent(type: "blog" | "ctf" | "research")`, `getContentBySlug(type, slug)`.
- Shared frontmatter shape across all three types:

```yaml
---
title: "Post Title"
slug: "post-title"
date: "2026-08-01"
summary: "One or two sentence summary."
tags: ["networking", "walkthrough"]
draft: true
---
```

- Routes, same pattern for each of `blog`, `ctf`, `research`:
  - `/[type]/page.tsx`, listing page, filterable by tag, sorted newest-first, drafts hidden in production (only visible via a dev-mode flag).
  - `/[type]/[slug]/page.tsx`, one shared `ContentPageTemplate` component reused across all three types (differences, if any, e.g. CTF posts might want a "category/difficulty" badge, are handled via optional extra frontmatter fields, not by forking the template).
- Write **one real seed post per type** (`content/blog/`, `content/ctf/`, `content/research/`), even if it's explicitly a "coming soon, first real post in progress" placeholder post, the goal is proving the architecture end-to-end, exactly like Chapter 4 did for Projects. This is the direct payoff of your original requirement that these "future" sections not require redesigning the site when you're ready to actually write in them.
- Home page and nav: decide whether these three get a home page preview section too, or stay nav-only for now given they're marked "future" in your original brief, recommendation: nav-only is fine for launch, add home page previews later once there's enough real content to preview.

---

## Acceptance Criteria for Chapter 6

- [ ] `/certifications` shows the full real list with working filters, distinct from the home page preview.
- [ ] `/resume` renders a real, styled resume and the download button produces an actual current PDF.
- [ ] `/blog`, `/ctf`, `/research` all exist, list their (currently single) seed post correctly, and their `[slug]` pages render via the shared `ContentPageTemplate`.
- [ ] Adding a second real post to any of the three, tested live during this chapter, requires only a new `.mdx` file, no code changes.
- [ ] No nav link anywhere in the site still points to a Chapter-0-style placeholder page.

---

## Prompt to give Claude Code for this chapter

```
Read chapter-06-remaining-content.md and implement everything in it. Build
the full Certifications page (6.1) and Resume page (6.2) using the real data
from Chapter 2, for the resume, use implementation option (a), a maintained
PDF in /public/resume.pdf, unless I tell you otherwise. Extend the MDX
pipeline from Chapter 4 into a generic, type-parameterized content engine for
Blog/CTF/Research per 6.3, sharing one ContentPageTemplate. Write one real
seed post per content type, ask me for the actual content/topic rather than
inventing fictional posts, or use an explicit "coming soon" placeholder post
if I don't have real content ready yet.

Prove the "add a post = one new file" requirement live for at least one of
the three content types. Confirm no nav link in the site still resolves to a
Chapter 0 placeholder page. Report against the Acceptance Criteria.
```
