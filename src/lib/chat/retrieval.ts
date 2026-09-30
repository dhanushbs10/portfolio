export type Chunk = {
  id: string;
  source: string;
  title: string;
  section?: string | null;
  text: string;
};

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "but", "if", "then", "else", "for", "to",
  "of", "in", "on", "at", "by", "with", "from", "as", "is", "are", "was",
  "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "shall", "should", "can", "could", "may", "might", "must",
  "not", "no", "nor", "so", "than", "that", "this", "these", "those", "it",
  "its", "he", "she", "they", "them", "we", "you", "i", "about", "into",
  "over", "under", "after", "before", "during", "between", "out", "up", "down",
  "off", "again", "here", "there", "when", "where", "why", "how", "all",
  "any", "both", "each", "few", "more", "most", "other", "some", "such",
  "what", "which", "who", "whom", "whose", "his", "her", "hers", "their",
  "my", "your", "our", "ours", "also", "very", "just", "like", "own", "one",
  "two", "three", "just", "been", "being", "while", "via", "per", "within",
  "the", "also", "though", "because", "from", "through", "until",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/&amp;/g, " and ")
    .replace(/&lt;/g, " less than ")
    .replace(/&gt;/g, " greater than ")
    .replace(/[^a-z0-9#+.\-'/]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w+#.]+|[^\w+#.]+$/g, ""))
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

function buildIndex(chunks: Chunk[]) {
  const docLen = chunks.map((c) => tokenize(c.text).length);
  const avgDocLen = docLen.reduce((a, b) => a + b, 0) / Math.max(docLen.length, 1);
  const df = new Map<string, number>();
  const tf = chunks.map(() => new Map<string, number>());
  for (let i = 0; i < chunks.length; i++) {
    const seen = new Set<string>();
    for (const tok of tokenize(chunks[i].text)) {
      tf[i].set(tok, (tf[i].get(tok) ?? 0) + 1);
      if (!seen.has(tok)) {
        seen.add(tok);
        df.set(tok, (df.get(tok) ?? 0) + 1);
      }
    }
  }
  const N = chunks.length;
  const idf = new Map<string, number>();
  for (const [term, n] of df) {
    idf.set(term, Math.log(1 + (N - n + 0.5) / (n + 0.5)));
  }
  return { tf, df, idf, docLen, avgDocLen, N };
}

export function bm25Search(
  chunks: Chunk[],
  query: string,
  opts: { topK?: number; k1?: number; b?: number; minScore?: number } = {}
): { chunk: Chunk; score: number }[] {
  const { topK = 6, k1 = 1.5, b = 0.75, minScore = 1.25 } = opts;
  const { tf, idf, docLen, avgDocLen, N } = buildIndex(chunks);

  const qTerms = tokenize(query);
  if (!qTerms.length) return [];

  const scores = chunks.map((_, i) => {
    const dl = docLen[i];
    let score = 0;
    for (const term of qTerms) {
      const f = tf[i].get(term) ?? 0;
      if (!f) continue;
      const w = idf.get(term) ?? 0;
      score += w * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * (dl / avgDocLen))));
    }
    const boost =
      chunks[i].source === "projects" ? 1.6 : chunks[i].source === "profile" ? 1.25 : 1;
    return score * boost;
  });

  return chunks
    .map((chunk, i) => ({ chunk, score: scores[i] }))
    // A weak lexical overlap is not enough evidence to ground an answer.
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((r) => ({ chunk: r.chunk, score: r.score }));
}
