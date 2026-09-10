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
      model: "nvidia/nemotron-3.5-lightning-30b-a3b",
      messages,
      stream: false,
      temperature: 0.6,
      max_tokens: 256,
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
      model: "nvidia/nemotron-3.5-lightning-30b-a3b",
      messages,
      stream: true,
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 512,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Chat ${res.status}: ${await res.text()}`);
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");
  const decoder = new TextDecoder();
  let lineBuf = "";
  let outputBuf = "";
  let lastYielded = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    lineBuf += decoder.decode(value, { stream: true });
    const lines = lineBuf.split("\n");
    lineBuf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") {
        // Yield any remaining clean content
        if (outputBuf.length > lastYielded) yield outputBuf.slice(lastYielded);
        return;
      }
      try {
        const parsed = JSON.parse(payload);
        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) {
          outputBuf += delta;
          const cleaned = outputBuf.replace(/<think>[\s\S]*?<\/think>/g, "");
          if (cleaned.length > lastYielded) {
            yield cleaned.slice(lastYielded);
            lastYielded = cleaned.length;
          }
        }
      } catch {}
    }
  }
}
