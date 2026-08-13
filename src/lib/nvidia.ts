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

export async function chatCompletion(
  messages: ChatMessage[],
  signal?: AbortSignal
): Promise<string> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NVIDIA_KEY}`,
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages,
      stream: false,
      max_tokens: 256,
      frequency_penalty: 0.6,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`NVIDIA chat ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
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
      // ponytail: Ping spent two model iterations before landing here.
      //
      // 1. Nemotron-3-Nano (30B) could not hold Ping's policy (strict Dhanush-only
      //    scope, two distinct fallbacks, a hard em-dash ban, length caps, anti-
      //    narration): each rule held only ~60% across 5 tuning rounds. It wrote
      //    code on some phrasings, used the wrong fallback on others, leaked
      //    reasoning, and invented a home address from nothing. Cause was model
      //    quality, not the prompt.
      // 2. meta/llama-3.1-70b-instruct fixed policy compliance but latency is
      //    erratic and slow: 7 to 120s per answer, frequent 429s, and it omits the
      //    mandated 2008 birth-year citation on "how old is he" (half the age
      //    answers state an age without grounding it).
      //
      // meta/llama-3.1-8b-instruct is the current choice. Head-to-head probe on
      // the live production prompt (11 cases: who/age/code-refusals/PII-refusal/
      // projects/birthday/math/identity) scored 8B 10/11 vs 70B 9/11, where 70B's
      // two misses were HTTP_429 rate-outs and 8B's single miss was using the
      // broader refusal phrasing on "exact home address" (still a correct refusal,
      // just not the exact PII-fallback wording). 8B responds in 1 to 7s (avg ~3s)
      // vs 70B's 7 to 120s, and 8B always cites 2008 on age questions. Dense
      // instruct (not reasoning) so no thinking leakage and no chat_template_kwargs.
      // 8B dense is also notably cheaper, which matters for a free portfolio bot.
      //
      // Other candidates verified unavailable on this NVIDIA account: 3.3-70b
      // times out, nemotron 70b/49b 404, mistral-large-2 404, qwen/gemma/phi/yi
      // all 404 or 410. Only the llama-3.1 instruct family responds.
      model: "meta/llama-3.1-8b-instruct",
      messages,
      stream: true,
      // max_tokens 768: hard backstop so a repetition loop is bounded (a 6-bullet
      // answer fits with headroom, so capping never truncates a real answer). Kept
      // from the Nemotron config; the llama instruct models stop cleanly on their
      // own, so this is pure insurance rather than a load-bearing loop-breaker.
      max_tokens: 768,
      // frequency_penalty 0.6: discourages re-using already-generated tokens. Was
      // added for Nemotron's repetition spiral; the llama models do not exhibit
      // it, but a mild penalty is harmless and guards any future regression. Keep
      // until a concrete overrun shows it hurting.
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
    // ponytail: keep the trailing partial line, a data: JSON split across
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
