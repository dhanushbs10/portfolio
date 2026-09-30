# Portfolio audit

Reviewed locally from `master` at `fd25f23` on 2026-09-30. This checkout is isolated at `G:\Fixes\portfolio-current-20260930`; no commit or push was made.

## Fixed in this checkout

- **Ping mixed unrelated and private material into visitor answers.** `src/lib/chat/knowledge.ts` indexed a 779-line personal profile alongside public project data and CV facts. The removed profile included wide-ranging interests, personal history, and instructions explicitly saying it was not the authoritative project catalog. That import and file are removed; chatbot retrieval now uses the maintained site profile and `src/data/projects.ts`. Phone, email, and date of birth are excluded from chatbot context.
- **Weak lexical matches could be presented as evidence.** `src/lib/chat/retrieval.ts` had no relevance floor. BM25 now drops matches below a minimum score. If nothing reliable remains, `/api/chat` returns a clear fallback rather than asking the model to improvise from conversation history.
- **Prior assistant output could become factual context.** The API now uses recent visitor questions to resolve follow-ups, but only sends the current user question to the model. Request size, message count, and individual message length are capped; malformed and assistant-only bodies are rejected.
- **High severity dependency advisory.** `npm audit` found vulnerable `path-to-regexp` 6.1.0 below `@vercel/routing-utils`. A 6.3.0 override was added instead of npm's suggested breaking downgrade of `@astrojs/vercel`. Audit now reports zero vulnerabilities.
- **CI smoke paths did not match Vercel output.** The smoke script looked for generated pages at `dist/` although Astro writes them under `dist/client/`. It now checks the correct output, includes `/chat`, and verifies Vercel's `/api/chat` function route.
- **Deployment documentation and environment template were missing/inaccurate.** README now describes the Vercel server function instead of claiming a static-only deployment; `.env.example` is present and is no longer ignored.

## Remaining audit findings

1. **Ping's modal needs complete keyboard and screen-reader handling.** `src/components/PingWidget.astro` sets `role="dialog"` and `aria-modal="true"`, but does not trap focus or return focus to the launcher on close. The streaming conversation also has no live-region announcement. This is the next chatbot UI pass after grounding.
2. **Abuse controls are per-process memory.** The message rate limiter and three-strike guard in `src/pages/api/chat.ts` / `src/lib/chat/guard.ts` are not shared or durable across Vercel serverless instances and cold starts. Treat them as best-effort friction, not a hard quota or persistent ban.
3. **Ping's production behavior depends on Vercel environment configuration.** Without `NIM_API_KEY`, the endpoint falls back to listing retrieved headings rather than generating a natural answer. The local build cannot confirm that production has the required variables; verify them in the Vercel project settings before deploying.
4. **Contact information is intentionally public on `/contact`.** The same email and phone are rendered directly into the page and can be scraped. Confirm that publishing both is still desired.
5. **The profile and CV repeat facts in separate files.** `src/data/profile.ts`, `src/data/cv.ts`, the resume image/PDF, and project case studies can drift. Keep one maintained source per fact or add content consistency checks in a future pass.
6. **The requested CTF flag feature is not part of this RAG pass.** A client-side flag cannot be kept secret in a public portfolio bundle. Design it as a challenge with server-side verification and a deployment secret, then configure that secret in Vercel.

## Validation

- `npm run build` — passed using the Vercel adapter. Local Node 26 emits an adapter warning and selects Vercel's Node 24 runtime.
- `node scripts/smoke.mjs` — passed: 15 generated HTML files, required routes/assets, and the `/api/chat` Vercel function route.
- `npm audit` — passed with zero vulnerabilities after the dependency override.

All modifications remain local and uncommitted.
