# Dhanush B S — Portfolio

A personal portfolio site built around a "structured signal" aesthetic — dark-mode-first,
network/circuit-inspired visuals, and a terminal-flavored voice throughout. Includes **Ping**,
an AI assistant grounded on my own background that visitors can actually talk to instead of
just reading a static bio.

**Live:** [bsdhanush.qzz.io](https://bsdhanush.qzz.io)

## Highlights

- **Ping** — an AI chat assistant (NVIDIA NIM / Nemotron) that answers visitor questions about
  me, grounded on a curated fact sheet with abuse/jailbreak guarding
- Animated tech-stack marquee, hover-reveal project cards, and scroll-triggered reveals
- Fully responsive, dark-mode-first design system

## Tech Stack

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4 (CSS variables + theme extension)
- Framer Motion, GSAP
- shadcn/ui
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit `/dev/kitchen-sink` to see the
design tokens and component sandbox.

You'll need your own `.env.local` with API keys for the chat assistant to work locally — see
`.env.example` for the required variable names.

## Project Structure

Built chapter-by-chapter from a design-system-first scaffold — see `src/app`, `src/components`,
and `src/data` for the main structure.

## Contact

- GitHub: [@dhanushbs10](https://github.com/dhanushbs10)
- Email: dhanushpoojari101@gmail.com
