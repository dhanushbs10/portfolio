# Chapter 7 — Contact Form & Email Delivery

**Goal of this chapter:** turn the static contact UI from Chapter 1 into a fully working, spam-resistant contact form that delivers real email to you via Resend.

**Prerequisites:** Chapters 0–3 complete.

---

## 7.1 Form Implementation

- `ContactSection.tsx` (already exists from Chapter 1) gets wired to React Hook Form + a Zod schema:

```ts
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(2000),
  honeypot: z.string().max(0), // must stay empty — bots fill it, humans never see it
});
```

- The `honeypot` field is a real form field, visually hidden via CSS (not `display:none`, which some bots detect — use an off-screen positioning technique), never shown to real users. If it arrives non-empty on submit, silently reject without an error (don't tell bots why).
- Client-side validation errors render inline per field, accessible (`aria-invalid`, `aria-describedby` linking to error text).
- Submit button shows a loading state and disables during submission; success and error states both get clear, distinct UI feedback (not just a toast that could be missed).

## 7.2 API Route

- `app/api/contact/route.ts` — `POST` handler:
  1. Re-validate the payload server-side with the same Zod schema (never trust client validation alone).
  2. Reject if honeypot is filled.
  3. Basic rate limiting — simplest viable approach: an in-memory or edge-config sliding window keyed by IP (a few requests per minute is plenty; this doesn't need to be sophisticated for a personal portfolio's traffic level).
  4. Send via Resend using a server-side API key (`process.env.RESEND_API_KEY`, never exposed client-side).
  5. Return a typed JSON response (`{ success: true }` or `{ success: false, error: string }`) that the form reads to drive its success/error UI state.

## 7.3 Email Template

- A clean transactional email template (Resend supports React Email components — use this rather than a raw HTML string, it's the idiomatic approach and easier to style consistently) containing the submitted name/email/subject/message, formatted for quick scanning since you'll be reading these on your phone as often as not.
- Reply-to header set to the submitter's email so you can respond directly from your inbox.

## 7.4 Social/Professional Links

- Confirm the links block alongside the form (GitHub, LinkedIn, email, any CTF platform profiles) is complete and every link opens correctly in a new tab with proper `rel="noopener noreferrer"`.

---

## Acceptance Criteria for Chapter 7

- [ ] Submitting the form with valid data sends a real email to you via Resend, tested live.
- [ ] Submitting with invalid data (bad email, too-short message) shows correct inline errors and does not hit the API route.
- [ ] Filling the honeypot field (test manually by un-hiding it in devtools and typing in it) results in a silent rejection, not a delivered email.
- [ ] Rapid repeated submissions are rate-limited.
- [ ] Full flow is keyboard-accessible and screen-reader-usable (labels, error announcements).
- [ ] No API key of any kind appears in client-side JS bundles (check the Network/Sources tab).

---

## Prompt to give Claude Code for this chapter

```
Read chapter-07-contact-form.md and implement everything in it. Wire the
existing ContactSection to React Hook Form + Zod per 7.1, build the
/api/contact route per 7.2 with server-side validation, honeypot rejection,
and basic IP-based rate limiting, and set up the Resend email template per
7.3 using React Email components with reply-to set to the submitter.

Ask me for my Resend API key and destination email to put in .env.local (do
not hardcode them). Test the full flow live — valid submission, invalid
submission, honeypot rejection, and rate limiting — before reporting against
the Acceptance Criteria.
```
