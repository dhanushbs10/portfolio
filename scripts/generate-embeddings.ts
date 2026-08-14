// @ts-nocheck
#!/usr/bin/env tsx
/**
 * Content embedding pipeline.
 * Reads portfolio data by regex-extracting TS exports (no TS module resolution needed),
 * chunks content, embeds via OpenRouter, and upserts into Supabase.
 *
 * Usage: npx tsx scripts/generate-embeddings.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually (tsx doesn't auto-load dotenv)
function loadEnv(filepath: string): void {
  const content = fs.readFileSync(filepath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}
loadEnv(path.join(process.cwd(), ".env.local"));

// ── Config ──────────────────────────────────────────────────────────────────
const EMBEDDING_MODEL = "openai/text-embedding-3-small";
const CHUNK_MAX_WORDS = 200;
const CHUNK_MIN_WORDS = 30;
const BATCH_SIZE = 20;

// ── Supabase & OpenRouter ────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const nvidiaKey = process.env.NVIDIA_API_KEY;
if (!nvidiaKey) { console.error("Missing NVIDIA_API_KEY"); process.exit(1); }

// ── TS Module Loader ─────────────────────────────────────────────────────────
function loadModule(filepath: string): Record<string, unknown> {
  const allLines = fs.readFileSync(filepath, "utf-8").split("\n");
  const out: string[] = [];
  let skip = false;
  let skipTypeBlock = false;
  let typeDepth = 0;

  for (const rawLine of allLines) {
    const trimmed = rawLine.trim();
    // Skip type aliases (no braces) and interface bodies (brace-delimited)
    if (/^export\s+type\b/.test(trimmed)) continue;
    if (/^export\s+interface\b/.test(trimmed)) { skipTypeBlock = true; typeDepth = 0; }
    if (skipTypeBlock) {
      for (const ch of trimmed) { if (ch === '{') typeDepth++; if (ch === '}') typeDepth--; }
      if (typeDepth <= 0) skipTypeBlock = false;
      continue;
    }
    // Skip imports (possibly multiline)
    if (/^import/.test(trimmed)) { skip = true; continue; }
    if (skip) { if (trimmed.includes(";") || trimmed === "") skip = false; else continue; }
    // Skip comments, empty, JSDoc
    if (/^(\/\/|\/\*|\*|$)/.test(trimmed)) continue;

    let line = rawLine;
    // Strip " as const/Type" at end of statement
    line = line.replace(/\s+as\s+(const|\w+)\s*;?\s*$/, "");
    // Strip type annotations ONLY before "=" (assigned variable declarations)
    line = line.replace(/\s*:\s*\w[\w.<>\[\]|{},.()\s]*\s*(?==)/g, "");
    // Remove export keyword
    line = line.replace(/^export\s+/g, "");
    out.push(line);
  }

  const code = out.join("\n").replace(/(?:var|let|const)\s+(\w+)\s*=/g, "exports.$1 =");
  const fn = new Function("exports", code);
  const exp: Record<string, unknown> = {};
  fn(exp);
  return exp;
}

// ── Text Helpers ─────────────────────────────────────────────────────────────
const chunkText = (text: string): string[] => {
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0);
  const chunks: string[] = [];
  let current = "";
  for (const para of paragraphs) {
    const combined = current ? current + "\n\n" + para : para;
    if (combined.split(/\s+/).length > CHUNK_MAX_WORDS && current.split(/\s+/).length >= CHUNK_MIN_WORDS) {
      chunks.push(current);
      current = para;
    } else {
      current = combined;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text.trim()];
};

const stripFrontmatter = (content: string): string => content.replace(/^---[\s\S]*?---\s*/, "");

// ── Embedding ────────────────────────────────────────────────────────────────
async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch("https://integrate.api.nvidia.com/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${nvidiaKey}` },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text, encoding_format: "float" }),
  });
  if (!res.ok) { const err = await res.text(); throw new Error(`Embedding failed (${res.status}): ${err}`); }
  const data = await res.json();
  return data.data[0].embedding;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];
  for (const text of texts) {
    try { results.push(await getEmbedding(text)); }
    catch (err) { console.error(` Embed error (${text.split(/\s+/).length}w): ${err}`); results.push(new Array(1536).fill(0)); }
  }
  return results;
}

// ── Data Extraction ──────────────────────────────────────────────────────────
function valueToChunks(source: string, value: unknown): { source: string; content: string }[] {
  const out: { source: string; content: string }[] = [];
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item !== "object" || item === null) continue;
      const obj = item as Record<string, unknown>;
      const parts: string[] = [];
      for (const [k, v] of Object.entries(obj)) {
        if (Array.isArray(v)) { const a = v as unknown[]; if (a.length) parts.push(`${k}: ${a.join(", ")}`); }
        else if (typeof v === "string" && v) parts.push(`${k}: ${v}`);
        else if (typeof v === "number" || typeof v === "boolean") parts.push(`${k}: ${v}`);
      }
      const text = parts.join(", ");
      if (text.trim()) chunkText(text).forEach((c) => out.push({ source, content: c }));
    }
  } else if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    const lines: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      if (Array.isArray(v)) { const a = v as unknown[]; if (a.length) lines.push(`${k}: ${a.join(", ")}`); }
      else if (typeof v === "string" && v) lines.push(`${k}: ${v}`);
      else if (typeof v === "object" && v !== null && !Array.isArray(v)) lines.push(`${k}: ${JSON.stringify(v)}`);
      else if (typeof v !== "undefined") lines.push(`${k}: ${v}`);
    }
    const text = lines.join("\n");
    if (text.trim()) chunkText(text).forEach((c) => out.push({ source, content: c }));
  }
  return out;
}

// ── Database Helper ──────────────────────────────────────────────────────────
async function insertChunk(source: string, content: string, embedding: number[]) {
  const { error } = await supabase.rpc("insert_chunk", {
    p_source: source,
    p_content: content,
    p_embedding: embedding,
  });
  if (error) throw new Error(`Insert failed [${source}]: ${error.message}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Ping Content Embedding Pipeline ===\n");
  const allDocs: { source: string; content: string }[] = [];

  // ── MDX Projects ─────────────────────────────────────────────────────────
  const projectDir = path.join(process.cwd(), "content", "projects");
  const projectFiles = fs.readdirSync(projectDir).filter((f) => f.endsWith(".mdx"));
  console.log(`Loading ${projectFiles.length} project MDX files...`);
  for (const file of projectFiles) {
    const raw = fs.readFileSync(path.join(projectDir, file), "utf-8");
    const body = stripFrontmatter(raw).trim();
    const source = `project:${file.replace(/\.mdx$/, "")}`;
    chunkText(body).forEach((chunk) => allDocs.push({ source, content: chunk }));
  }

  // ── Data Modules ─────────────────────────────────────────────────────────
  const srcDir = path.join(process.cwd(), "src", "data");
  const dataFiles = fs.readdirSync(srcDir).filter((f) => f.endsWith(".ts"));
  console.log(`Loading ${dataFiles.length} data modules...`);
  for (const file of dataFiles) {
    const prefix = file.replace(/\.ts$/, "");
    const mod = loadModule(path.join(srcDir, file));
    for (const [name, value] of Object.entries(mod)) {
      valueToChunks(`${prefix}:${name}`, value).forEach((d) => allDocs.push(d));
    }
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const bySource = new Map<string, number>();
  for (const d of allDocs) bySource.set(d.source, (bySource.get(d.source) || 0) + 1);
  console.log("\nChunks per source:");
  for (const [src, count] of bySource) console.log(`  ${src}: ${count}`);
  console.log(`\nTotal chunks: ${allDocs.length}`);

  // ── Clear existing ────────────────────────────────────────────────────────
  console.log("\nClearing content_chunks...");
  const { error: delErr } = await supabase.from("content_chunks").delete().neq("id", 0);
  if (delErr) console.error("  Delete error:", delErr.message);

  // ── Embed + Upsert ────────────────────────────────────────────────────────
  console.log(`\nEmbedding with ${EMBEDDING_MODEL} (batch ${BATCH_SIZE})...`);
  for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
    const slice = allDocs.slice(i, i + BATCH_SIZE);
    const embeddings = await embedBatch(slice.map((d) => d.content));
    for (let j = 0; j < slice.length; j++) {
      await insertChunk(slice[j].source, slice[j].content, embeddings[j]);
    }
    const done = Math.min(i + BATCH_SIZE, allDocs.length);
    process.stdout.write(`\r  ${done}/${allDocs.length}`);
  }

  // ── Verify ────────────────────────────────────────────────────────────────
  const { count } = await supabase.from("content_chunks").select("*", { count: "estimated", head: true });
  console.log(`\n\nDone. Rows in DB: ${count}`);
  console.log("Verify: SELECT source, count(*) FROM content_chunks GROUP BY source ORDER BY source;");
}

main().catch((err) => { console.error("Fatal:", err); process.exit(1); });
