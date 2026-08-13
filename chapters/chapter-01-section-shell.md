# Chapter 1, Static Section Shell (Home Page Scaffold)

**Goal of this chapter:** build every section of the home page (`/`) with correct structure, spacing, and scroll-reveal motion, using placeholder/lorem copy where real content isn't ready yet. The point of this chapter is to make the page feel like *one continuous experience* before real content or data exists. Get the choreography right first; content gets swapped in later without touching layout.

**Prerequisites:** Chapter 0 complete (design tokens, SectionHeading, Nav/Footer exist).

**Do not build in this chapter:** the motherboard scene (Chapter 5), the projects data system (Chapter 4), real certifications/roadmap data (Chapter 6), the contact form logic (Chapter 7). Every section here can use placeholder copy/props, the components and their animation behavior are what matter.

---

## 1.1 Sections to Build (in this exact order, each as its own component in `/components/sections/`)

For **each** section below, build: the component, its scroll-reveal-in animation (Framer Motion `useInView` + variants, using the motion tokens from `/lib/animations.ts`), and correct responsive behavior at mobile/tablet/desktop breakpoints.

1. **`Hero.tsx`**, full viewport height. Name, role identity line, one-sentence thesis, animated background (subtle network-graph/particle motif, canvas or SVG, GPU-cheap, must not block LCP). Scroll-cue indicator at the bottom (animated chevron or line) that fades out on scroll.
2. **`AboutMe.tsx`**, two-column on desktop (portrait/illustration + copy), stacked on mobile. Placeholder copy is fine; structure is what matters.
3. **`Journey.tsx`**, a timeline component (vertical on mobile, can be vertical or horizontal-scroll-within-section on desktop, your call, vertical is simpler and safer). Each timeline node reveals on scroll with a stagger.
4. **`Education.tsx`**, card or list layout, program name, institution, dates, relevant coursework tags.
5. **`SkillsPreview.tsx`**, NOTE: this is a *preview* here, not the full categorized system (that's data-driven in Chapter 3). Build a static grid with placeholder categories/chips just to validate layout and the "hover/tap reveals detail" micro-interaction.
6. **`TechStack.tsx`**, logo grid of tools you use daily, grouped loosely, marquee or grid layout (your call, a slow infinite marquee row works well here and is a nice motion beat between the denser Skills and Certifications sections).
7. **`CertificationsPreview.tsx`**, card row, "earned/in progress/planned" visual states established here (this state-styling gets reused for real in Chapter 6).
8. **`ProjectsPreview.tsx`**, 3 to 4 featured project cards, "View all projects →" link to `/projects` (route stub exists from Chapter 0). Card component built here gets reused in the real `/projects` grid in Chapter 4, build it well.
9. **`HomeLabTeaser.tsx`**, one striking static image/frame + a strong headline + "Explore my setup →" link to `/homelab`. Deliberately simple in this chapter; the real experience is Chapter 5.
10. **`RoadmapPreview.tsx`**, done/doing/next columns or a horizontal progress-style layout, placeholder items.
11. **`Achievements.tsx`**, small stat/highlight cards (e.g. CTF placements), placeholder data.
12. **`ContactSection.tsx`**, layout and static form UI only (inputs, labels, submit button), no submission logic yet, that's Chapter 7. Also include social/professional links here.

## 1.2 Section-to-Section Transitions ("the continuous story" requirement)

This is the part that separates this build from a typical isolated-sections portfolio:

- Maintain **one persistent background layer** (fixed-position gradient/canvas behind all sections) whose color/intensity shifts gradually as the user scrolls through the page, driven by overall scroll progress (`useScroll` at the page level, passed down via context or a shared hook). Sections sit on top of this shared background rather than each defining their own `bg-*` block, this alone eliminates the "stack of isolated cards" feeling.
- No hard section borders. Where a visual separator is needed, use a soft gradient blend or a subtle animated line/divider, not a flat `border-t`.
- Each section's entrance animation should feel like a continuation of the previous section's exit, not a fresh pop-in, stagger children in the same direction the user is scrolling (upward reveal), keep easing consistent (reuse the motion tokens from Chapter 0, don't invent new ones per section).
- Build a single `<AnimatedReveal>` wrapper component in `/components/shared/` used by every section for its entrance animation, so the whole page has one consistent motion language instead of 12 slightly different ones.

## 1.3 Page Assembly

- `app/(marketing)/page.tsx` imports and orders all 12 sections. Keep this file thin, it should read like a table of contents, not contain logic.
- Confirm scroll performance with Chrome DevTools' Performance panel, target no long tasks >50ms during scroll on your own machine.

---

## Acceptance Criteria for Chapter 1

- [ ] Scrolling from Hero to Contact feels like one continuous piece, not 12 separate pages stacked vertically (this is a subjective but real check, if it doesn't feel that way, fix the transitions before moving on).
- [ ] Every section reveals smoothly once, does not re-trigger jankily on scroll-up/down repeatedly.
- [ ] Fully responsive at 375px, 768px, 1280px, 1920px.
- [ ] No layout shift (CLS) from animations, reserve space before elements animate in.
- [ ] `prefers-reduced-motion` respected: reveal animations become instant/opacity-only, no transforms.
- [ ] Placeholder content is clearly placeholder (e.g. bracketed `[Project Name]`) so nothing gets mistaken for final copy later.

---

## Prompt to give Claude Code for this chapter

```
Read chapter-01-section-shell.md and implement everything in it, building on
the Chapter 0 foundation already in this repo. Build all 12 home page sections
listed in 1.1 as separate components in /components/sections/, each with
scroll-reveal animation using Framer Motion and the motion tokens from
/lib/animations.ts. Implement the shared persistent background and the single
<AnimatedReveal> wrapper described in 1.2 so section transitions feel
continuous rather than isolated. Use clearly-marked placeholder content where
real data doesn't exist yet, do not invent fake specific claims (fake cert
names, fake project results, etc.), just use obvious placeholders like
[Project Name] or [Cert Name].

Do not build the motherboard scene, real data fetching, or the contact form's
submit logic, those are later chapters. When done, report against every item
in the Acceptance Criteria section.
```
