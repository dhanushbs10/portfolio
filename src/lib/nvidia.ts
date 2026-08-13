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
      max_tokens: 1024,
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
    buf += decoder.decode(value, { stream: !done });
    for (const line of buf.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {}
    }
    buf = "";
  }
}
