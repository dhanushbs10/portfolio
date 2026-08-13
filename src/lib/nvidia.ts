export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const NVIDIA_KEY = process.env.NVIDIA_API_KEY;
if (!NVIDIA_KEY) throw new Error("Missing NVIDIA_API_KEY");

const BASE = "https://integrate.api.nvidia.com/v1";

async function post(path: string, body: unknown) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NVIDIA_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`NVIDIA ${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getEmbedding(text: string): Promise<number[]> {
  const data = await post("/embeddings", {
    model: "nvidia/nv-embed-v1",
    input: text,
    encoding_format: "float",
  });
  return data.data[0].embedding;
}

export async function* chatCompletionStream(
  messages: ChatMessage[],
  signal?: AbortSignal
) {
  const res = await fetch(BASE + "/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NVIDIA_KEY}`,
    },
    body: JSON.stringify({
      // ponytail: Nemotron-3-Nano (30B) could not hold Ping's policy — strict
      // Dhanush-only scope with two distinct fallbacks, a hard em-dash ban,
      // length caps, and an anti-narration rule. Each rule held only ~60% of
      // the time across 5 prompt-tuning rounds (whack-a-mole): it wrote code
      // on some phrasings, used the wrong fallback on others, leaked reasoning
      // ("Let me check the reference..."), and invented a home address from
      // nothing. The cause was model quality, not the prompt. meta/llama-3.1-
      // 70b-instruct is 70B dense instruct (not a reasoning model → no thinking
      // leakage, no chat_template_kwargs needed) and obeys short-output + scope
      // instructions on probe. Verified candidate choice: meta/llama-3.3-70b-
      // instruct times out (120s, never returns) on this account; nvidia/
      // llama-3.1/3.3-nemotron-* 70B/49B return 404 or empty; mistral-large-2
      // returns 404. llama-3.1-70b is the one available stronger model that
      // actually responds. Latency is erratic (2–56s on a ping) but always
      // answers; the SSE stream masks first-token latency for the UI.
      model: "meta/llama-3.1-70b-instruct",
      messages,
      stream: true,
      // max_tokens 768: hard backstop so a repetition loop is bounded (a 6-bullet
      // answer fits with headroom, so capping never truncates a real answer). Kept
      // from the Nemotron config; Llama-3.1-70B stops cleanly on its own, so this
      // is now pure insurance rather than a load-bearing loop-breaker.
      max_tokens: 768,
      // frequency_penalty 0.6: discourages re-using already-generated tokens. Was
      // added for Nemotron's repetition spiral; Llama-3.1 does not exhibit it, but
      // a mild penalty is harmless and guards any future regression. Keep until a
      // concrete overrun shows it hurting.
      frequency_penalty: 0.6,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Chat ${res.status}: ${await res.text()}`);
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    // ponytail: keep the trailing partial line — a data: JSON split across
    // network reads would be silently dropped if we reset buf to "" each loop.
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {}
    }
  }
}
