# Chapter 4, Projects System (MDX + GitHub Integration)

**Goal of this chapter:** a scalable project showcase where adding a new project means adding one MDX file, zero code changes. This is the chapter that proves your "add content without redesigning" requirement for real.

**Prerequisites:** Chapters 0 to 3 complete.

---

## 4.1 Content Pipeline

- Install `next-mdx-remote` (or Contentlayer2 if Claude Code recommends it fits Next 15 better at build time, either is acceptable, pick one and stay consistent) plus `gray-matter` for frontmatter parsing.
- Create `content/projects/`, each project is one `.mdx` file, filename = slug.
- Frontmatter schema (matches the `Project` type from the master plan):

```yaml
---
title: "Project Title"
slug: "project-title"
summary: "One or two sentence summary for cards."
coverImage: "/images/projects/project-title/cover.png"
techStack: ["Python", "Nmap", "Docker"]
githubRepo: "yourusername/repo-name"   # optional
liveDemo: "https://..."                 # optional
status: "in-progress"                    # in-progress | completed | archived
featured: true
---
```

- MDX body structure (use consistent `##` headings across every project file so the template can style them predictably): Overview, Architecture, Challenges, Solutions, Lessons Learned, Future Improvements. Screenshots go in `/public/images/projects/[slug]/`.
- `/lib/mdx.ts`: `getAllProjects()`, `getProjectBySlug(slug)`, `getFeaturedProjects()`, parse frontmatter + compiled MDX body, typed against the `Project` type.

## 4.2 Routes

- **`/projects/page.tsx`**: grid of `ProjectCard` (reuse the card component built in Chapter 1's `ProjectsPreview`, now data-driven for real). Add client-side filter/sort by tech stack tag and status, this can be simple `useState` filtering over the already-fetched list, no need for URL-driven filters unless you want shareable filtered links (nice-to-have, not required).
- **`/projects/[slug]/page.tsx`**: the deep-dive template. Structure:
  1. Header: title, status badge, tech stack chips, GitHub/live-demo buttons.
  2. Live GitHub stats badge row (see 4.3).
  3. Rendered MDX body.
  4. Screenshot gallery (simple lightbox-on-click grid, lazy-loaded).
  5. "Future improvements" callout styled distinctly (visually signals "this is honest, ongoing work," reinforcing the student-in-progress framing).
  6. Prev/next project navigation at the bottom.
- Use `generateStaticParams` for all project slugs (SSG) and `generateMetadata` per project for SEO/OG.

## 4.3 GitHub Integration

- `/lib/github.ts`: server-only functions using the GitHub REST API (`octokit` or plain `fetch` with your PAT from `process.env.GITHUB_TOKEN`, **never** `NEXT_PUBLIC_`-prefixed):
  - `getRepoStats(repo: string)` → stars, forks, open issues, last commit date, primary language, language breakdown.
  - Cache via Next.js `fetch` with `next: { revalidate: 3600 * 6 }` (every 6 hours), GitHub stats don't need to be real-time and this avoids rate-limit risk.
- `GithubStatsBadge.tsx`, renders the above as a compact stat row on each project page. If `githubRepo` is absent in frontmatter, the badge doesn't render (not an empty/broken one).
- Optional (nice-to-have, not required for this chapter's acceptance): a GitHub contribution graph on the main `/projects` page header, using GitHub's own stats-image service or a lightweight self-rendered chart from the GraphQL contributions API.

## 4.4 Seed Content

- Write at least 2 to 3 real projects as MDX files now, even in draft/rough form. This chapter isn't done with zero real project files, the whole point is proving the pipeline against real content, not a hypothetical schema.

---

## Acceptance Criteria for Chapter 4

- [ ] `/projects` renders real project cards from MDX, filterable by tag/status.
- [ ] `/projects/[slug]` renders the full template correctly for every seeded project.
- [ ] Adding a **new** project, tested live during this chapter, requires only adding one new `.mdx` file (plus its images) and needs zero component/route code changes.
- [ ] GitHub stats badge shows real live data for any project with a `githubRepo`, and cleanly omits itself otherwise.
- [ ] `ProjectsPreview` on the home page (deferred from Chapter 3) is now wired to `getFeaturedProjects()`.
- [ ] No GitHub token exposed client-side (check network tab, token should never appear in any browser request).

---

## Prompt to give Claude Code for this chapter

```
Read chapter-04-projects-system.md and implement everything in it. Build the
MDX content pipeline per 4.1, the /projects and /projects/[slug] routes per
4.2, and the server-side GitHub API integration per 4.3, GitHub token must
only ever be read server-side via process.env, never exposed to the client.
Write 2-3 real seed project MDX files based on projects I actually describe
to you (ask me for the details rather than inventing fictional projects).
Wire the home page's ProjectsPreview section to getFeaturedProjects().

After building, prove the "add a project = one new file" requirement by
walking through adding one more project live and confirming no other code
changed. Report against the Acceptance Criteria.
```
