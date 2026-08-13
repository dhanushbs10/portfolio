import { NextRequest, NextResponse } from "next/server";
import { chatCompletionStream, ChatMessage } from "@/lib/nvidia";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const MAX_MESSAGES = parseInt(process.env.RATE_LIMIT_MAX_MESSAGES || "20", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_HOURS || "1", 10) * 60 * 60 * 1000;

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

// ── Load portfolio content ──
// nemotron-3-nano-30b-a3b has 128k context — no truncation needed
function loadPortfolioContent(): string {
	const pieces: string[] = [];

	function extractValues(raw: string): string[] {
		const values: string[] = [];
		for (const line of raw.split("\n")) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			if (/^(import|export|type|interface|\/\/|\/|\*)/.test(trimmed)) continue;
			if (trimmed.includes("=") && !trimmed.startsWith("//")) {
				const val = trimmed.split("=").slice(1).join("=").trim().replace(/,$/, "");
				if (val) values.push(val);
			} else if (trimmed.startsWith("const") && trimmed.includes(":")) {
				const m = trimmed.match(/:\s*(.+?)(?:\s*[,=]|$)/);
				if (m) values.push(m[1].trim());
			}
		}
		return values;
	}

	// Read MDX project files
	const projectDir = join(process.cwd(), "content", "projects");
	try {
		for (const f of readdirSync(projectDir).filter((f) => f.endsWith(".mdx"))) {
			const raw = readFileSync(join(projectDir, f), "utf-8");
			const body = raw.replace(/^---[\s\S]*?---\s*/, "").trim();
			if (body) pieces.push(`# ${f.replace(/\.mdx$/, "")}\n\n${body}`);
		}
	} catch {}
	// Read TS data modules
	const srcDir = join(process.cwd(), "src", "data");
	try {
		for (const f of readdirSync(srcDir).filter((f) => f.endsWith(".ts"))) {
			const raw = readFileSync(join(srcDir, f), "utf-8");
			const values = extractValues(raw);
			if (values.length) pieces.push(`# ${f.replace(/\.ts$/, "")}\n\n${values.join("\n")}`);
		}
	} catch {}
	return pieces.join("\n\n---\n\n");
}

const SYSTEM_PROMPT = `You are Ping - an AI assistant representing Dhanush on his portfolio site.
CRITICAL RULES:
- NEVER write long responses. Maximum 3 to 4 sentences unless the user explicitly asks for detail. Short, direct answers only.
- Broad questions like who is he, tell me about Dhanush, or introduce him get a 2 to 3 sentence overview — do NOT list every detail from the profile.
- For specific questions, answer specifically and concisely. Do not dump unrelated information.
- You are NOT Dhanush. You are Ping, his AI assistant. Never say "I built this" - say "Dhanush built this."
- Answer ONLY using the reference material provided below. If the user asks something not covered, say "I don't have that information in Dhanush's portfolio."
- Politely decline unrelated requests. Redirect: "I'm here to help you learn about Dhanush!"
- Never say "As an AI, I..." or give LLM disclaimers.
- Never use emojis. No emojis in any response — ever. Plain text only.

LIST FORMATTING RULES:
- When listing projects, skills, interests, or any items: use clean bullet points (one item per line starting with -).
- Each bullet should be short — project name, one-line description, tech used. No paragraphs inside lists.
- Maximum 5 to 6 bullets per list. If there are more, group them or mention only the most relevant ones.
- Never write a wall of text when a list would be clearer.

${loadPortfolioContent()}`;

function getClientIp(req: NextRequest): string {
	return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export async function POST(req: NextRequest) {
	try {
		const ip = getClientIp(req);
		if (!checkRate(ip)) {
			return NextResponse.json({ error: `Rate limit reached. Try again in ${WINDOW_MS / 3600000} hour(s).` }, { status: 429 });
		}

		const body = await req.json();
		const userMessages: ChatMessage[] = body.messages || [];
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