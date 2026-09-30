import type { APIRoute } from "astro";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

export const prerender = false;

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });

export const POST: APIRoute = async ({ request }) => {
  const flag = process.env.CTF_FLAG;
  if (!flag) return json({ ok: false, message: "The verifier is not configured yet." }, 503);

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, message: "JSON required." }, 415);
  }
  if (Number(request.headers.get("content-length") ?? 0) > 512) {
    return json({ ok: false, message: "Proof is too long." }, 413);
  }

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 512) return json({ ok: false, message: "Proof is too long." }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  const submittedFlag = body && typeof body === "object" && "flag" in body && typeof body.flag === "string"
    ? body.flag.trim()
    : "";
  if (!submittedFlag || submittedFlag.length > 96) return json({ ok: false, message: "Enter a flag to submit." }, 400);

  const submitted = Buffer.from(submittedFlag, "utf8");
  const expected = Buffer.from(flag.trim(), "utf8");
  const matches = submitted.length === expected.length && timingSafeEqual(submitted, expected);
  return matches
    ? json({ ok: true, message: "Correct flag. Signal recovered." })
    : json({ ok: false, message: "Incorrect flag. Keep searching." }, 401);
};
