# bsdhanush.qzz.io

Portfolio for **Dhanush B S** — Cybersecurity & Networking student, Bengaluru.

Built with **Astro 7** + **Tailwind CSS v4** + small React islands (React Bits ProfileCard and PixelSnow hero, interactive labs). Pages are prerendered, with a Vercel serverless endpoint for Ping. Project case studies are sourced from the author's project READMEs.

## Routes

| Route              | Page                              |
| ------------------ | --------------------------------- |
| `/`                | Home — hero, dossier rail, stats  |
| `/work`            | Archive — 07 case files           |
| `/work/[slug]`     | Per-project case study + live lab |
| `/overview`        | About / skills / roadmap          |
| `/resume`          | Resume + detailed CV              |
| `/contact`         | Contact                           |
| `/chat`            | Ping chatbot (floating widget opens here too) |
| `/api/chat`        | Ping RAG endpoint (BM25 + NVIDIA NIM streaming, guard tier) |
| `/404`             | Custom 404                        |

## Case studies (07)

| #  | Slug                | Category    | Discipline        |
| -- | ------------------- | ----------- | ----------------- |
| 01 | phantomsection      | Security    | C++ shellcode loader |
| 02 | droplink            | Security    | WebRTC + AES-256-GCM |
| 03 | vynlore             | Systems     | Tauri v2 music player |
| 04 | shellplay           | Web         | Browser Linux terminal |
| 05 | pxe-network-boot-lab| Networking  | DHCP 66/67 + TFTP    |
| 06 | esp8266-wake-on-lan | Networking  | NodeMCU magic packet |
| 07 | cross-subnet-smb-fix| Networking  | Layer-3 diagnosis    |

Each case page embeds a working interactive lab (Phantom XOR viewer, HKDF-SHA256 transfer, synth, Linux shell, PXE replay, ESP wiring check, SMB before/after).

## Development

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # prerendered pages + Vercel serverless output → dist/
npm run preview    # preview the build
```

Deploy through the Vercel adapter (`vercel dev` locally or Vercel project deployment). The `/api/chat` route needs the environment variables below; a static-only host cannot run Ping's API.

## Ping chatbot

Floating widget on every page (`src/components/PingWidget.astro`) backed by
`src/pages/api/chat.ts`: BM25 retrieval over the public profile and project data,
streamed answers from NVIDIA NIM, 20-message cap per refresh. Abuse hardware:
input-regex tiers, decode pass, LLM classifier (fail-open), canary plus
system-prompt-only overlap output check, per-IP 3-strikes cooldown, hashed
server logs. Copy `.env.example` to `.env` for local development. Set `NIM_API_KEY`, `NIM_MODEL`,
`TEASE_MODEL`, `RATE_LIMIT_MAX_MESSAGES`, `GUARD_SALT`.
