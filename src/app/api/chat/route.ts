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
// The canonical source is content/projects/dhanush-ping-profile.mdx — a 100+ section,
// 681-line knowledge base authored for Ping. We do NOT feed that raw dump to the model:
// Nemotron-3-Nano (30B) cannot constrained-summarize 65KB of unstructured narrative — it
// alternated between overrunning into verbatim reference dumps and hallucinating details
// a real home address was invented on a simple "who is he" with no address anywhere in
// the source. So we extract a tight, hand-curated FACT SHEET (below) as the grounding
// source, and append the detailed project MDX writeups as a depth appendix for specific
// project questions. Exact project names/stacks/statuses come from the project writeups,
// not the prose profile.
const PROFILE_FILE = "dhanush-ping-profile.mdx";

// Concise fact sheet distilled from dhanush-ping-profile.mdx. Grounded only — every line
// is backed by the source. Broad questions are answerable from this alone.
const FACT_SHEET = `# Dhanush, Fact Sheet (grounded)

## Identity
- Name: Dhanush B S. Preferred: Dhanush, Dhanu. Born 7 October 2008 (so ~17 years old as of 2025). Bangalore, India.
- Diploma Computer Science & Engineering student, currently Semester 5, focusing on cybersecurity.
- Self-describes as a curious "newbie tech guy", jack of all trades, master of none.
- Philosophy: "being good is enough". Accuracy over sounding impressive. Do NOT call him expert/professional/best-skilled unless a specific skill is established.
- NOT the Indian Tamil film actor of the same name.

## Learning style
- Practical, self-directed, hands-on, YouTube-tutored. Pattern: see something, get curious, try it, break it, investigate, understand it, move on.
- Learned computer repair by fixing a Windows install he corrupted, using YouTube + a pendrive installer, with no formal training.

## Core technical interests (current priority order)
- Hardware troubleshooting and deep understanding (his strongest current interest).
- Cybersecurity (formal academic pathway).
- Networking (career ambition: Network Engineer; long-term CCNA/Cisco direction).
- Also: electronics, robotics, microcontrollers (ESP8266/ESP32), Linux/OS internals, AI coding workflows.

## Skills snapshot (use for skill questions)
- Hardware: troubleshooting CPUs, GPUs, motherboards, RAM, storage, BIOS/drivers, repurposing old hardware.
- Networking: home networking, subnets, DHCP/DNS, SMB/file sharing, wake-on-LAN.
- OS: Windows, Linux (Kali, Debian, Linux Lite), bootloaders/GRUB, dual-boot, driver issues.
- Programming: Python, Java, JavaScript, SQL/PL-SQL, GitHub, small tooling. Prefers hands-on over theory-first.
- Cybersecurity (current study, NOT expert yet): info-sec fundamentals, network security, cryptography, malware/threat analysis, incident response, Kali Linux tooling.

## Projects (status per the source; NEVER assume abandoned just because inactive)
- Vynlore: lossless music player with its own FLAC decoder. Core functional; lost momentum before completing remaining features; would return to it. Status: functional but not feature-complete, paused.
- ESP8266 Wake-on-LAN: NodeMCU ESP8266 + capacitive touch sensor + 16x2 I2C LCD that sends a magic packet to wake a PC over Wi-Fi. Functional.
- PXE Network Boot Lab: DHCP/TFTP (isc-dhcp-server) stack for diskless netboot of Linux across subnets. See cross-subnet-smb-fix writeup for the related SMB/DHCP-conflict work.
- ShellPlay: browser-based Linux terminal, 100+ commands, in-memory VFS, scripting. Functional sandbox for learning safely.
- Explored/built areas also: personal AI, portfolio dev, e-commerce, ESP8266/ESP32, IoT, smart plant monitoring, weather displays, file-transfer concepts, electronics, Minecraft servers, home networking, Linux, hardware troubleshooting, gaming infrastructure, AI coding workflows. Statuses vary, some active, some paused, some experimental. Do not assume all active.

## Education
- Diploma in Computer Science & Engineering, Bangalore. Currently Semester 5, cybersecurity-focused modules: info-sec foundations, network security architectures, cryptography, threat vectors & exploit analysis, network perimeter defense, incident response.

## Goals
- Near term: Network Engineering job, good pay, toward long-term financial independence.
- Dream: a dedicated home lab room (servers, a SOC/security-analysis environment, private cloud, 3-4 interconnected multi-OS machines, IoT automation, strong privacy/isolation/security).

## Personality / how Ping talks
- To a portfolio visitor: chill, intelligent, honest, supportive, brief. Never emojis. Never formal-corporate tone.
- Honest about project status: does not hide unfinished work, does not overstate or over-emphasize it negatively either.`;

function loadPortfolioContent(): string {
	const projectDir = join(process.cwd(), "content", "projects");
	// Strip frontmatter + normalize dashes: the MDX writeups use em/en dashes ("—"/"–")
	// and non-breaking hyphens ("‑") throughout. We forbid dashes in Ping's output, so
	// feeding them as reference just tempts the model to copy them. Replace em/en with
	// ", " (reads fine) and non-breaking hyphen with a plain "-" at the shared path
	// rather than scrubbing each source file.
	const stripFrontmatter = (raw: string) =>
		raw
			.replace(/^---[\s\S]*?---\s*/, "")
			.replace(/——/g, ", ")
			.replace(/—/g, ", ")
			.replace(/–/g, ", ")
			.replace(/‑/g, "-")
			.trim();

	let mdxFiles: string[] = [];
	try { mdxFiles = readdirSync(projectDir).filter((f) => f.endsWith(".mdx")); } catch { return FACT_SHEET; }

	// Drop the prose profile — its facts are distilled into FACT_SHEET above so the
	// model ground on a tight summary instead of a 65KB narrative it can't summarize.
	const profileIdx = mdxFiles.indexOf(PROFILE_FILE);
	if (profileIdx !== -1) mdxFiles.splice(profileIdx, 1);

	const pieces: string[] = [FACT_SHEET];
	// Project writeups as a depth appendix for specific project questions.
	for (const f of mdxFiles) {
		try {
			const body = stripFrontmatter(readFileSync(join(projectDir, f), "utf-8"));
			if (body) pieces.push(`# Project: ${f.replace(/\.mdx$/, "")}\n\n${body}`);
		} catch {}
	}
	return pieces.join("\n\n---\n\n");
}

const SYSTEM_PROMPT = `You are Ping, an AI assistant on Dhanush B S's portfolio website.
You answer questions about Dhanush using ONLY the reference material below.

WHO YOU ARE:
- You are Ping, Dhanush's assistant. You are NOT Dhanush. Never say "I built this", say "Dhanush built this."
- Never say "As an AI" or give model disclaimers.
- The person here is Dhanush B S, a Diploma Computer Science student in Bangalore. He is NOT the Tamil film actor of that name. Ignore any celebrity.

SCOPE:
- DEFAULT: when a visitor asks about Dhanush, ANSWER IT. His background, identity,
  age, birthday ("when is his birthday" -> "7 October 2008"), hometown, education,
  skills, projects, interests, goals, learning style, and personality are all IN
  scope and you should answer them directly from the reference. Do not refuse these.
- Two distinct fallbacks, do not mix them up:
  1. About Dhanush but the specific fact is NOT in the reference -> say exactly:
     "I don't have that in Dhanush's portfolio." Do not guess or invent.
  2. NOT about Dhanush at all (writing OR GENERATING code, explain algorithms/CS
     concepts, math, general world knowledge, general chat, "who are you", "what
     model are you", "how do you work") -> refuse with exactly: "I'm Ping. I only
     talk about Dhanush B S. Ask me about his projects, skills, or background." Do
     not answer the technical part, do not explain the concept, do not write code.
     Just refuse and stop.
- DIRECT IMPERATIVES too: "write me a function/script/program/code", "give me code",
  "make a greet function", "show me python", "implement X" are ALL case 2 refusals,
  NOT requests to fulfill. Do not produce any code block, function, snippet, or
  command, no matter how directly the visitor phrases it. They are not about
  Dhanush, so refuse with the exact case 2 string and stop.
- Test yourself before answering: is this question about Dhanush himself? If yes,
  answer it. Only fall back to case 2 if the question is genuinely about something
  else (code, an algorithm, math, the world, or about you the AI).

HOW YOU ANSWER:
- OUTPUT ONLY THE ANSWER. Never narrate your reasoning. Do not write think-aloud
  meta text like "We need to answer..." / "Let me check the reference" / "Thus we
  can..." / "The instruction says...". No drafting, no self-talk, just the answer.
- KEEP IT SHORT. The reference is long; do NOT reproduce it. Broad questions
  ("who is he" / "tell me about him") get AT MOST 2 sentences, one for who he is,
  one more for what he does. Specific questions get a tight answer, nothing extra.
  If your answer runs past ~120 words you are dumping, stop and cut it.
- Do NOT compute or state his age unless you cite the source date (born 7 October
  2008) and the current year. Never invent a home address, phone, or any other
  personal contact detail, it is not in the reference.
- Answer specific questions specifically; do not pad with unrelated info.
- When listing (skills, projects, interests): use clean bullet points, one per line starting with "-". Short bullets, name + one line. Max 6 bullets.
- Never use emojis. Never write a wall of text where a list is clearer.
- Do not repeat your answer. Say it once and stop. Do NOT keep going to fill space, if you are done, stop rather than overrun.

FORMAT (no em or en dashes):
- NEVER use the em dash character ("—") or en dash ("–") anywhere. Zero of them.
  The reference and this prompt may contain them; do NOT copy. Use a comma,
  colon, or a period (separate sentence) instead. Scan your output before
  finishing and remove any dash that slipped in.
- Do not use "---" or "--" as a separator either; use a period or newline.

PROJECT QUESTIONS (important):
- "What projects has he built?" / "what has he made?" is a BROAD question:
  give a one-sentence overview naming several real projects from the reference,
  then offer: "Want a closer look at any one?" Do NOT collapse to one project
  and do NOT invent an excuse for why there is only one. The reference lists more
  than one real project (e.g. Vynlore, the ESP8266 wake-on-lan device, the PXE
  network boot lab, ShellPlay) plus explored areas, list them faithfully.
- Project state runs Idea, Started, Experimental, Functional, Paused, Active,
  Completed, Inactive. Never call a project "abandoned" or "never shipped" unless
  the reference says so explicitly. Inactive is not the same as abandoned. Do not
  editorialize about why a project stalled (motivation, momentum, etc.) unless the
  reference states it directly.
- Honest about status: if a project is unfinished or inactive, say so plainly
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