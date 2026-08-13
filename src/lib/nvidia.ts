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
      model: "nvidia/nemotron-3-nano-30b-a3b",
      messages,
      stream: true,
      // Nemotron intermittently degenerates: it finishes a coherent answer, then
      // re-emits it verbatim until it hits the token ceiling (finish_reason
      // "length", no natural stop). Two levers at the shared path:
      //  - max_tokens 768: hard backstop so a loop is bounded (a 6-bullet answer
      //    fits with headroom, so capping never truncates a real answer).
      //  - frequency_penalty 0.6: discourages re-using already-generated tokens,
      //    breaking the repetition spiral. Probed: cut intermittent dups 37.5%→0
      //    on the worst query, shrank overrun, no quality regression elsewhere.
      max_tokens: 768,
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
