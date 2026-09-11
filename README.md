# Dhanush B S, Portfolio

A personal portfolio site built around a "structured signal" aesthetic, dark-mode-first,
network/circuit-inspired visuals, and a terminal-flavored voice throughout. Includes **Ping**,
an AI assistant grounded on my own background that visitors can actually talk to instead of
just reading a static bio.

**Live:** [bsdhanush.qzz.io](https://bsdhanush.qzz.io)

## Highlights

- **Ping**, an AI chat assistant (NVIDIA NIM / Nemotron) that answers visitor questions about
  me, grounded on a curated fact sheet with abuse/jailbreak guarding, rate limiting, and a
  fail-closed safety classifier
- Animated tech-stack marquee, WebGL background, hover-reveal project cards, and scroll-triggered
  reveals
- Fully responsive, dark-mode-first design system

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4 (CSS variables + theme extension)
- Framer Motion
- OGL (WebGL background scene)
- Lucide React icons
- MDX project writeups (next-mdx-remote)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need your own `.env.local` with API keys for the chat assistant to work locally, see
`.env.example` for the required variable names.

## Project Structure

- `src/app` - pages and the chat API route
- `src/components` - shared components, sections, chat widget
- `src/data` - structured content (skills, certifications, hardware, contact, ...)
- `src/lib` - types, MDX loader, NVIDIA client, data access layer
- `content/projects` - MDX writeups for each project

## Contact

- GitHub: [@dhanushbs10](https://github.com/dhanushbs10)
- Email: dhanushpoojari101@gmail.com