# Portfolio Website, Master Implementation Plan
### "The Digital Identity Project", Cybersecurity & Networking Portfolio

This document is the complete build plan for your portfolio. It's written so you can hand it directly to Claude Code, phase by phase, as a working spec. Each phase is scoped to be a realistic single (or few) Claude Code session(s), with clear inputs, outputs, and acceptance criteria.

---

## 1. Guiding Principles (read this before building anything)

1. **One continuous scroll-story, not a stack of pages.** Sections aren't isolated `<section>` blocks, they hand off motion/scroll state to each other (shared scroll progress, persistent background canvas, cross-fading themes).
2. **Content-driven, not hardcoded.** Every repeatable entity (project, cert, hardware part, blog post, CTF writeup) is data (MDX/JSON/DB row) rendered through one component. Adding content should never mean touching layout code.
3. **Student honesty, not fake seniority.** Copy tone throughout: curious, building-in-public, "here's what I learned," not "10 years of experience."
4. **Performance is a feature.** A cinematic scroll site that's janky on a mid-range laptop undermines the whole pitch of a security/networking engineer who understands systems. Budget for 60fps.
5. **Progressive enhancement for the showpiece.** The motherboard scroll experience is the flagship, but it must degrade gracefully (static breakdown) on low-power devices, reduced-motion settings, and if JS/WebGL fails.

---

## 2. Final Tech Stack (confirmed)

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | Server Components by default, Client Components only where interactivity/animation demands it |
| Styling | Tailwind CSS + shadcn/ui | Design tokens in `globals.css`, shadcn for form/dialog/nav primitives only, not for the hero/motherboard |
| Animation (2D) | Framer Motion + `useScroll`/`useTransform` | Section transitions, reveal animations, parallax |
| Animation (scroll-driven cinematic) | GSAP + ScrollTrigger, layered with either SVG or React Three Fiber (see §6) | Framer Motion is not built for pinned, scrubbed, multi-stage timelines, GSAP ScrollTrigger is the right tool specifically for the motherboard sequence |
| Icons | Lucide React | |
| Content | MDX (via `next-mdx-remote` or Contentlayer2) for blog/writeups/research notes | Git-versioned content, no CMS needed initially |
| Structured data | PostgreSQL via Supabase | Projects, certifications, hardware components, skills, timeline, anything you'll want to query/filter/sort |
| ORM | Drizzle ORM (typed, lightweight, plays well with Supabase Postgres) | |
| Forms | React Hook Form + Zod | Contact form, future guestbook/comments |
| Email | Resend | Contact form delivery + optional "new blog post" notify |
| Auth | NextAuth (Auth.js) v5 | Only needed once you add an admin/CMS panel, stub it, don't build it in Phase 1 |
| GitHub data | GitHub REST/GraphQL API via server-side fetch + ISR/on-demand revalidation | Never client-fetch GitHub directly (rate limits, token exposure) |
| Deployment | Vercel | Edge caching, image optimization, analytics |
| Version control | Git/GitHub, conventional commits, protected `main` | |

---

## 3. Information Architecture

### 3.1 Route map

```
/                          → single-page scroll experience (Hero → About → Journey →
                              Education → Skills → Tech I Use → Certifications →
                              Projects preview → Home Lab teaser → Roadmap →
                              Achievements → Contact)
/homelab                   → full immersive Home Lab / motherboard scroll experience
/projects                  → project grid/list (filterable by tag/tech)
/projects/[slug]           → individual project deep-dive page
/certifications            → full cert wall (grid, filter by provider/status)
/resume                    → styled resume view + download PDF
/blog                      → future write-ups index (MDX)
/blog/[slug]                → individual post
/ctf                       → future CTF writeup index
/ctf/[slug]                → individual CTF writeup
/research                  → future research notes index
/research/[slug]           → individual note
/contact                   → (also embedded as a section on `/`, but has its own route for direct links)
```

Single-page home + deep-link-able sub-pages is the right shape: recruiters skimming get the story in one scroll; anyone who wants depth on a specific project/cert/writeup gets a real page with its own URL and OG image for sharing on LinkedIn.

### 3.2 Section order on `/` (the "story")

1. **Hero**, name, role identity ("Aspiring Cybersecurity & Networking Professional"), one-line thesis, subtle animated background (particle/network-graph motif, not generic gradient blobs), scroll-cue.
2. **About Me**, who you are beyond the resume, what draws you to security/networking, personality.
3. **My Journey**, horizontal or vertical timeline: how you got here, key turning points.
4. **Education**, degree/program, relevant coursework, notable academic projects.
5. **Technical Skills**, categorized grid (see §5).
6. **Technologies I Use**, daily-driver tools/stack, distinct from "skills" (skills = competencies, tech = tools).
7. **Certifications**, cards with logo, status (earned/in progress/planned), verify link.
8. **Projects**, top 3 to 4 featured, "View all projects" → `/projects`.
9. **Home Lab teaser**, striking still frame from the motherboard scene + "Explore my setup" → `/homelab`.
10. **Learning Roadmap**, done / doing / next, visually distinct states.
11. **Achievements**, CTF placements, competition results, notable milestones.
12. **Contact**, form + social/professional links.

Future sections (Blog/CTF/Research) get nav entries and teaser cards but live at their own routes, don't cram their full content into the scrollytelling home page.

---

## 4. The Home Lab / Motherboard Experience, Detailed Spec

This is the centerpiece, so it gets its own section.

### 4.1 Two implementation paths, pick one deliberately

**Option A, Illustrated SVG motherboard + GSAP ScrollTrigger (recommended to build first)**
- A single large, hand-composed (or AI-generated then cleaned up) top-down SVG illustration of a motherboard, with each real component (CPU socket, RAM slots, GPU, chipset, PCIe lanes, SATA ports, power delivery/VRMs, M.2 slots) as a distinct, labeled SVG group/layer.
- Camera movement = animating a wrapping `<div>`'s CSS transform (`translate`/`scale`) on the SVG, driven by GSAP ScrollTrigger's `scrub`, not real 3D.
- Pros: fast to build, fully controllable, tiny bundle, great performance, easy to make look premium with lighting/glow via SVG filters + Framer Motion highlight pulses.
- Cons: less "wow" than true 3D, but far more reliable to ship well.

**Option B, React Three Fiber 3D model + scroll-scrubbed camera path**
- A real (or stylized) 3D motherboard model (glTF), camera moves along a spline synced to scroll progress (`@react-three/drei`'s `ScrollControls` + a `CatmullRomCurve3` path).
- Pros: genuinely more impressive if executed well, true "cinematic camera" framing.
- Cons: much higher build cost, needs an actual 3D model (source/commission/build one), GPU/perf risk on low-end devices, **and your own dev machine has no dedicated GPU beyond a GT 710**, so heavy local dev iteration on a 3D scene will be painful. Reserve for a v2 if the SVG version lands well and you want to level up.

**Recommendation:** build Option A end-to-end first (it alone will already stand out, most student portfolios don't have this), ship it, then evaluate Option B as a v2 upgrade once the rest of the site is solid.

### 4.2 Interaction model
- Pin the motherboard stage (`position: sticky` or GSAP `pin: true`) for the duration of the scroll sequence; content scroll pauses visually while the "camera" (transform) animates.
- Scroll progress (0→1 within the pinned section) drives a GSAP timeline with labeled stages: `overview → cpu → ram → gpu → storage(ssd) → storage(hdd) → chipset → network → pcie → cooling → power`.
- At each stage: (1) camera zooms/pans to that component, (2) that component gets a highlight (glow outline + dim everything else), (3) an info panel slides in with the component's copy.
- No clicks required, but keep click-to-jump nav dots on the side as an accessibility/impatience escape hatch (also improves discoverability and lets you deep-link, e.g. `/homelab#gpu`).
- On mobile: same data, different presentation, a simpler stacked "swipe-through" or scroll-snap card sequence per component rather than trying to force the pinned-camera effect on a small viewport (this is a UX decision, not a limitation, cinematic pans read poorly at 380px wide).
- Respect `prefers-reduced-motion`: fall back to a straightforward scrollable spec-sheet layout, same content, no pinning/zooming.

### 4.3 Component content model
Each hardware component is one row in a `hardware_components` table / JSON, rendered by one `<HardwareInfoPanel>`:

```ts
type HardwareComponent = {
  id: string;                // "cpu", "ram", "gpu-primary", ...
  name: string;
  category: "cpu" | "ram" | "gpu" | "storage" | "chipset" | "network" | "pcie" | "cooling" | "power";
  specs: string[];
  whyIChoseIt: string;
  upgradeHistory: string;
  currentPurpose: string;
  performanceNotes: string;
  personalExperience: string;
  futureUpgradePlans: string;
  sceneAnchor: { x: number; y: number; zoom: number }; // camera target for this component
};
```

### 4.4 Your actual rig, pre-loaded as seed data

Since this section is about *your real machine*, here's the seed content mapped directly from your specs so Claude Code can scaffold real entries instead of placeholders:

- **CPU**: Intel Core i5-4670K @ 3.40GHz (Haswell, 4C/4T, turbo 3.80GHz, AVX), good "why I chose it / what I learned running a lab on older-gen hardware" story (resourcefulness angle).
- **RAM**: ~9.6GB DDR3, honest framing: real-world constraint-driven lab work (e.g., what you can/can't run virtualized at this capacity, and upgrade plans).
- **GPU**: dual GPU setup: Intel HD 4600 (iGPU) + NVIDIA GT 710 (dedicated, GK208B, driver 470.256.02, CUDA 11.4), interesting because it's a *networking/security* lab, not a gaming rig, so the story is "why a low-power dedicated GPU still earns its slot" (e.g., encoding, CUDA experiments, display offload).
- **Storage**: Samsung SSD 840 112GB (boot-adjacent), Hitachi 149GB HDD, 2x Seagate ST500DM002 (~931GB combined), good material for a "storage tiering in a home lab" panel (OS/fast-access vs bulk/VM storage vs archive).
- **Network**: onboard Ethernet (active), WiFi (present, unused), ties directly into your Networking specialization; this panel can double as a segue into the networking-equipment section that follows the motherboard sequence.
- **OS/Environment**: Kali Linux Rolling, XFCE, X11/LightDM, Zsh, this is arguably your strongest "cybersecurity" signal and deserves its own callout card right after the motherboard sequence, not buried as a footnote.

Treat this as a first draft, you'll refine the actual prose (the "why/personal experience" fields are yours to write), but the specs themselves are already accurate and can be scaffolded directly.

### 4.5 Post-motherboard home lab continuation
After the component walkthrough, continue the same scroll into: monitors/peripherals, networking gear (router/switch/AP if any), virtualization environment (what hypervisor/VMs you run, VirtualBox/VMware/Proxmox etc.), guest OSes used for practice, any dedicated pentesting/CTF VMs, and general "how I use this lab to learn." This section can drop the pinned-camera technique and become a normal (but still animated/staggered) scroll section, the motherboard is the showpiece, not every subsequent paragraph.

---

## 5. Skills Section, Data Model

```ts
type SkillCategory =
  | "cybersecurity" | "networking" | "operating-systems" | "programming"
  | "web-development" | "tools" | "databases" | "version-control"
  | "cloud" | "virtualization";

type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: "learning" | "comfortable" | "proficient"; // no fake "expert" tier as a student
  icon: string;       // lucide icon name or custom svg path
  note?: string;       // optional one-liner ("built 3 labs with this")
};
```
Render as category tabs/accordion, each a responsive grid of skill chips. New skill = one array entry, zero layout changes, satisfies your "add without redesigning" requirement.

---

## 6. Projects System, Data Model & Page Template

```ts
type Project = {
  slug: string;
  title: string;
  summary: string;            // for cards
  coverImage: string;
  techStack: string[];
  githubRepo?: string;        // "owner/repo", powers live GitHub stats
  liveDemo?: string;
  status: "in-progress" | "completed" | "archived";
  featured: boolean;
  content: {
    overview: string;         // MDX body
    architecture: string;     // MDX, can include diagrams
    screenshots: string[];
    challenges: string;
    solutions: string;
    lessonsLearned: string;
    futureImprovements: string;
  };
};
```
- Store as MDX files under `content/projects/[slug].mdx` with frontmatter for the flat fields, gives you Git history, easy authoring, and static generation, with no DB needed just for this.
- `/projects/[slug]` is one template component that renders every project identically, new project = new `.mdx` file, nothing else changes (this directly satisfies your scalability requirement).
- **GitHub integration**: server component fetches repo stats (stars, last commit, language breakdown, open issues) via GitHub REST API at build/revalidate time (ISR, e.g. revalidate every few hours), never expose your token client-side, and cache aggressively to avoid rate limits.
- Contribution graph: embed via GitHub's own stats-image services or fetch and self-render with a small chart, decide during Phase 4 based on what looks best next to your design system.

---

## 7. Certifications, Roadmap, Achievements, Data Models (lighter-weight, same pattern)

```ts
type Certification = {
  id: string; name: string; issuer: string; logo: string;
  status: "earned" | "in-progress" | "planned";
  dateEarned?: string; credentialUrl?: string;
};

type RoadmapItem = {
  id: string; title: string; category: string;
  status: "done" | "in-progress" | "planned";
  targetQuarter?: string; notes?: string;
};

type Achievement = {
  id: string; title: string; description: string; date: string;
  category: "ctf" | "competition" | "academic" | "community";
};
```
All three: simple JSON/DB tables, rendered through one card/list template each. No custom layout work per new entry.

---

## 8. Content Systems (Blog / CTF Writeups / Research Notes)

- All three use the **same MDX-based content engine** (one `getContentBySlug`, `getAllContent` set of utilities, parameterized by content type/folder), don't build three separate systems.
- `content/blog/`, `content/ctf/`, `content/research/`, same frontmatter shape (title, date, tags, summary, draft flag), different folders, different route groups.
- Even though these are "future" sections, scaffold the routes, listing pages, and one seed/example post now with a "coming soon" placeholder, this proves the architecture works and means launching real content later is just adding files, not building anything new.

---

## 9. Folder Structure

```
/app
  /(marketing)/page.tsx              → home scroll experience
  /homelab/page.tsx
  /projects/page.tsx
  /projects/[slug]/page.tsx
  /certifications/page.tsx
  /resume/page.tsx
  /blog/page.tsx  /blog/[slug]/page.tsx
  /ctf/page.tsx   /ctf/[slug]/page.tsx
  /research/page.tsx /research/[slug]/page.tsx
  /contact/page.tsx
  /api/contact/route.ts
  /api/github/route.ts               → thin cached wrapper over GitHub API
/components
  /sections/                         → Hero, About, Journey, Skills, etc. (one per home-page section)
  /homelab/                          → MotherboardScene, HardwareInfoPanel, SceneNavDots, ...
  /projects/                         → ProjectCard, ProjectPageTemplate, GithubStatsBadge
  /ui/                                → shadcn primitives + your own design-system atoms
  /shared/                            → Nav, Footer, SectionHeading, AnimatedReveal
/content
  /projects  /blog  /ctf  /research   → MDX files
/lib
  /db/                                → Drizzle schema + client
  /github.ts                         → GitHub API fetch/cache helpers
  /mdx.ts                            → shared content-loading utilities
  /animations.ts                     → shared GSAP/Framer variants & timelines
/data
  /skills.ts /hardware.ts /roadmap.ts /achievements.ts   → static structured data (or seed for DB)
```

---

## 10. Build Phases (what to actually tell Claude Code, in order)

**Phase 0, Foundations**
Scaffold Next.js 15 + TS + Tailwind + shadcn, design tokens (colors/type/spacing reflecting a security/network aesthetic, think terminal/circuit motifs used tastefully, not clichéd "hacker green matrix rain"), base layout, nav, footer, dark-mode-first theme.

**Phase 1, Static section shell**
Build all home-page sections as static (no data yet) components with correct structure, spacing, and scroll-reveal animation via Framer Motion. Get the page feeling "alive" before wiring real content.

**Phase 2, Content data layer**
Set up Drizzle + Supabase (or start with typed local JSON and migrate later, recommend JSON first so you're not blocked on DB setup before there's anything to show), define all schemas from §5 to 7, seed with real content.

**Phase 3, Projects system**
MDX pipeline, `/projects` + `/projects/[slug]`, GitHub API integration with caching.

**Phase 4, The Home Lab / Motherboard experience**
Build Option A (SVG + GSAP ScrollTrigger) per §4, using your real hardware as seed content. This is the highest-effort phase, budget accordingly, and get the *interaction mechanics* working with placeholder art before investing in final SVG polish.

**Phase 5, Remaining content systems**
Certifications, Roadmap, Achievements, Resume page, Blog/CTF/Research scaffolding with placeholder posts.

**Phase 6, Contact + forms**
React Hook Form + Zod + Resend, spam protection (honeypot or simple rate limit, skip a captcha unless spam becomes a real problem).

**Phase 7, Polish pass**
SEO metadata + OG images per page, accessibility audit (keyboard nav through the motherboard section is critical, not optional), Lighthouse pass, responsive QA especially for the home lab section on mobile, `prefers-reduced-motion` fallback verification.

**Phase 8, Deploy**
Vercel project, environment variables (DB URL, Resend key, GitHub token), custom domain, analytics.

---

## 11. Acceptance Criteria (how you'll know each phase is actually done)

- Every section transitions into the next without a hard visual "seam" (shared background/gradient continuity, no abrupt white-to-dark jumps).
- Motherboard sequence runs at a stable frame rate on your own Kali machine (a fair proxy for a "modest hardware" visitor) with `prefers-reduced-motion` off, and gracefully becomes a static breakdown with it on.
- Adding a new project = one new MDX file, zero code changes elsewhere.
- Lighthouse: Performance ≥90, Accessibility ≥95, SEO ≥95 on both `/` and `/homelab`.
- Site is fully usable (not just "not broken") with keyboard-only navigation and with a screen reader on the nav/section landmarks.

---

## 12. Suggested First Prompt to Claude Code

Once you're ready to start, Phase 0 is the right first task. Something like:

> "Using the plan in `portfolio-master-plan.md`, scaffold Phase 0: a Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui project with the folder structure in §9, a dark-mode-first design token setup reflecting a cybersecurity/networking aesthetic, and a base layout with nav + footer. No section content yet, just the shell."

Feed it one phase at a time rather than the whole document at once, Claude Code will produce more coherent, reviewable output per phase than trying to generate the entire site in one pass.
