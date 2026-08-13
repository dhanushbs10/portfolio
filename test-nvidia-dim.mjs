// Quick check: what dims does NVIDIA's free embedding model return?
const key = process.argv[2];
if (!key) { console.error("Usage: node test-nvidia-dim.mjs <NVIDIA_API_KEY>"); process.exit(1); }
const res = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  body: JSON.stringify({ model: "nvidia/nv-embed-v1", input: "test embedding check", encoding_format: "float" }),
});
const data = await res.json();
console.log("Model:", data.model || "unknown");
console.log("Dimensions:", data.data?.[0]?.embedding?.length || data.data?.[0]?.embedding?.shape?.[1] || "unknown");
console.log("Response keys:", Object.keys(data));
