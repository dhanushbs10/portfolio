# dhanushbs10.dev

Portfolio for **Dhanush B S** — Cybersecurity & Networking student, Bengaluru.

Built with **Astro 7** + **Tailwind CSS v4** (pure static output, no framework runtime). Content is sourced directly from the author's real project READMEs — nothing invented, no terminal cosplay.

## Routes

| Route              | Page                              |
| ------------------ | --------------------------------- |
| `/`                | Home — hero, dossier rail, stats  |
| `/work`            | Archive — 07 case files           |
| `/work/[slug]`     | Per-project case study + live lab |
| `/overview`        | About / skills / roadmap          |
| `/contact`         | Contact                           |
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
npm run build      # static site → dist/
npm run preview    # preview the build
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).