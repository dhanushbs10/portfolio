import { NextRequest, NextResponse } from "next/server";
import { chatCompletionStream, ChatMessage } from "@/lib/nvidia";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

// ponytail: a portfolio visitor reading about Dhanush should never get locked
// out for a full hour. Keep an abuse backstop but make it forgiving + short.
// 40 messages / 15 min lets a real conversation + browsing breathe; the lock
// clears in minutes, not an hour.
const MAX_MESSAGES = parseInt(process.env.RATE_LIMIT_MAX_MESSAGES || "40", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_HOURS || "0.25", 10) * 60 * 60 * 1000;

// ponytail: in-memory rate map, resets on server restart — fine for a portfolio bot
const rateMap = new Map<string, { count: number; resetAt: number }>();
function pruneRates() {
	const now = Date.now();
	for (const [k, v] of rateMap) if (v.resetAt < now) rateMap.delete(k);
}
function checkRate(ip: string): boolean {
	pruneRates();
	const entry = rateMap.get(ip);
	if (!entry || entry.resetAt < Date.now()) {
		rateMap.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
		return true;
	}
	entry.count++;
	return entry.count <= MAX_MESSAGES;
}

// ── Load portfolio knowledge for Ping ──
// The canonical source is content/projects/dhanush-ping-profile.mdx — a 100+ section
// knowledge base authored specifically for Ping (identity, education, personality,
// projects, answering rules). It is loaded FIRST so identity leads the context.
// Detailed project writeups are appended as a depth appendix for specific project questions.
// We do NOT scrape src/data/*.ts with regex — that produced mangled fragments that
// caused the model to hallucinate ("famous Tamil actor Dhanush") instead of grounding.
const PROFILE_FILE = "dhanush-ping-profile.mdx";

function loadPortfolioContent(): string {
	const projectDir = join(process.cwd(), "content", "projects");
	const stripFrontmatter = (raw: string) => raw.replace(/^---[\s\S]*?---\s*/, "").trim();

	let mdxFiles: string[] = [];
	try { mdxFiles = readdirSync(projectDir).filter((f) => f.endsWith(".mdx")); } catch { return ""; }

	const pieces: string[] = [];
	// 1) Profile first — identity, rules, and the person lead the context.
	const profileIdx = mdxFiles.indexOf(PROFILE_FILE);
	if (profileIdx !== -1) {
		try {
			const body = stripFrontmatter(readFileSync(join(projectDir, PROFILE_FILE), "utf-8"));
			if (body) pieces.push(`# Dhanush — Profile (canonical knowledge base)\n\n${body}`);
		} catch {}
		mdxFiles.splice(profileIdx, 1);
	}
	// 2) Project writeups as a depth appendix (e.g. "tell me about the SMB fix").
	for (const f of mdxFiles) {
		try {
			const body = stripFrontmatter(readFileSync(join(projectDir, f), "utf-8"));
			if (body) pieces.push(`# ${f.replace(/\.mdx$/, "")}\n\n${body}`);
		} catch {}
	}
	return pieces.join("\n\n---\n\n");
}

const SYSTEM_PROMPT = `You are Ping — an AI assistant on Dhanush B S's portfolio website.
You answer questions about Dhanush using ONLY the reference material below.

WHO YOU ARE:
- You are Ping, Dhanush's assistant. You are NOT Dhanush. Never say "I built this" — say "Dhanush built this."
- Never say "As an AI…", never give model disclaimers.
- If asked something not in the reference: say "I don't have that in Dhanush's portfolio." Do not invent or guess.
- Politely decline unrelated requests and redirect: "I'm here to help you learn about Dhanush."
- The person Dhanush referred to here is Dhanush B S, a Diploma Computer Science student in Bangalore. He is NOT the Tamil film actor. Ignore any celebrity of that name.

HOW YOU ANSWER:
- OUTPUT ONLY THE ANSWER. Never narrate your reasoning. Do not write think-aloud
  meta text like "We need to answer…" / "Let me check the reference" / "Thus we
  can…" / "The instruction says…". No drafting, no self-talk — just the answer.
- Short and direct. 2–3 sentences for broad questions ("who is he / tell me about him"). Never dump the whole profile.
- Answer specific questions specifically; don't pad with unrelated info.
- When listing (skills, projects, interests): use clean bullet points, one per line starting with "-". Short bullets — name + one line. Max 6 bullets.
- Never use emojis. Never write a wall of text where a list is clearer.
- Do not repeat your answer. Say it once and stop.

PROJECT QUESTIONS (important):
- "What projects has he built?" / "what has he made?" is a BROAD question:
  give a one-sentence overview naming several real projects from the reference,
  then offer: "Want a closer look at any one?" — do NOT collapse to one project
  and do NOT invent an excuse for why there's only one. The reference lists more
  than one real project (e.g. Vynlore, the ESP8266 wake-on-lan device, the PXE
  network boot lab, ShellPlay) plus explored areas — list them faithfully.
- Project state runs Idea→Started→Experimental→Functional→Paused→Active→Completed→Inactive.
  Never call a project "abandoned" or "never shipped" unless the reference says
  so explicitly. Inactive ≠ abandoned. Do not editorialize about why a project
  stalled (motivation, momentum, etc.) unless the reference states it directly.
- Honest about status: if a project is unfinished/inactive, say so plainly
  without overstating or hiding it.

REFERENCE MATERIAL ABOUT DHANUSH:
${loadPortfolioContent()}`;

function getClientIp(req: NextRequest): string {
	return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(req: NextRequest) {
	try {
		const ip = getClientIp(req);
		const entry = rateMap.get(ip);
		if (!checkRate(ip)) {
			const waitMin = entry ? Math.ceil((entry.resetAt - Date.now()) / 60000) : 0;
			return NextResponse.json(
				{ error: `Rate limit reached. Try again in ${waitMin} min.` },
				{ status: 429 },
			);
		}

		const body = await req.json();
		const rawMessages: ChatMessage[] = body.messages || [];
		// Defensive sanitize at the trust boundary: drop empty / whitespace-only
		// turns. An empty trailing assistant turn (a UI streaming artifact) corrupts
		// the model output — it triggers repetition loops and bad completions.
		const userMessages = rawMessages.filter((m) => typeof m?.content === "string" && m.content.trim() !== "");
		if (!userMessages.length) return NextResponse.json({ error: "No messages provided" }, { status: 400 });

		const messages: ChatMessage[] = [
			{ role: "system", content: SYSTEM_PROMPT },
			...userMessages.slice(-20),
		];

		const stream = new ReadableStream({
			async start(controller) {
				const encoder = new TextEncoder();
				const sendEvent = (event: string, data: unknown) => {
					controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
				};
				try {
					let fullResponse = "";
					for await (const chunk of chatCompletionStream(messages)) {
						fullResponse += chunk;
						sendEvent("chunk", { content: chunk });
					}
					sendEvent("done", { content: fullResponse });
				} catch (err) {
					const msg = err instanceof Error ? err.message : "Stream failed";
					sendEvent("error", { message: msg });
				} finally {
					controller.close();
				}
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache, no-transform",
				Connection: "keep-alive",
			},
		});
	} catch (err) {
		console.error("Chat error:", err);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}