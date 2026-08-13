# Chapter 5, Home Lab / Motherboard Scroll Experience (Flagship Feature)

**Goal of this chapter:** the centerpiece of the whole portfolio, a scroll-driven cinematic exploration of your real PC, built as SVG + GSAP ScrollTrigger (Option A from the master plan). This is the highest-effort chapter. Budget more sessions for it than any other, and build in the sub-stages below rather than attempting it all at once.

**Prerequisites:** Chapters 0 to 3 complete (Chapter 4 not required first, order is flexible between 4 and 5, but don't attempt 5 before 0 to 3).

**Recommended sub-staging (tell Claude Code to treat these as mini-checkpoints within the chapter, confirming each works before moving to the next):**

---

## 5A, Motherboard Art Asset

- Source or produce one large, layered, top-down SVG of a motherboard. Each real component gets its own labeled `<g id="...">` group matching the `HardwareComponent.id` values from Chapter 2's `hardware.ts` (`cpu`, `ram`, `gpu-integrated`, `gpu-dedicated`, `storage-ssd`, `storage-hdd-1`, `storage-hdd-2`, `network`).
- If you don't have a source SVG, this is a legitimate place to pause and get/commission one rather than have Claude Code fabricate low-quality vector art, flag this explicitly as a manual dependency before continuing.
- Add SVG filter defs now for the "glow/highlight" and "dim" visual states (reusable `<filter>` elements referenced by class/id, not duplicated per component).

## 5B, Camera Rig Mechanics (placeholder art is fine for this stage)

- Build the pinned scroll container: `/components/homelab/MotherboardScene.tsx`, using GSAP + ScrollTrigger with `pin: true` and `scrub: true` on the wrapping section.
- Build the "camera" as a CSS transform (`translate3d` + `scale`) applied to the SVG's containing `<div>`, driven by a GSAP timeline with labeled stages matching each `HardwareComponent.id` in scroll order: `overview → cpu → ram → gpu-integrated → gpu-dedicated → storage-ssd → storage-hdd-1 → storage-hdd-2 → network → chipset → cooling → power` (drop any category you don't have real content for rather than inventing one).
- Each stage's target transform values come from `HardwareComponent.sceneAnchor` (fill these in for real now, replacing the `{x:0,y:0,zoom:1}` placeholders from Chapter 2, this requires eyeballing coordinates against the actual SVG, iterate visually).
- Get this working with a **placeholder colored-boxes SVG** first if the real art from 5A isn't ready, mechanics and art are separable problems, don't block one on the other.

## 5C, Highlight + Dim Synchronization

- At each stage, the active component group gets the glow filter/class; all other groups get a dim/desaturate class. Cross-fade this over ~200-300ms around each stage transition, not an instant snap.
- Connection traces: subtle animated line/pulse along the SVG's existing circuit traces leading into the active component, reinforcing "this connects to the rest of the system" (a `stroke-dashoffset` animation on relevant paths is the classic technique here, keep it subtle, not distracting).

## 5D, Info Panel

- `/components/homelab/HardwareInfoPanel.tsx`, slides/fades in per stage, rendering all fields from the matching `HardwareComponent` (specs, whyIChoseIt, upgradeHistory, currentPurpose, performanceNotes, personalExperience, futureUpgradePlans).
- Panel positioning should avoid covering the component it's describing, position dynamically per component (e.g. panel anchors right when the highlighted component is on the left half of the board, and vice versa).

## 5E, Navigation & Accessibility Escape Hatches

- `/components/homelab/SceneNavDots.tsx`, a fixed side rail of dots/labels, one per stage, click-to-jump (GSAP ScrollTrigger supports programmatic scroll-to-label). This is not optional polish, it's the accessibility and impatience escape hatch required by the master plan.
- Keyboard support: dots are real focusable/tabbable elements with visible focus states; arrow keys can step between stages when the scene has focus.
- `prefers-reduced-motion` fallback: detect via `matchMedia`, and when true, **skip the pinned/scrubbed scene entirely**, render a straightforward static spec-sheet layout (one card per `HardwareComponent`, stacked, all content visible, no pinning/zooming/transforms). Build this fallback as its own component (`HardwareSpecSheet.tsx`) so it's a real, well-designed alternative, not an afterthought.

## 5F, Mobile Presentation

- On small viewports, do not force the pinned-camera-pan effect, build a scroll-snap card sequence instead (`HardwareMobileSequence.tsx`), same data, one component per screen, simple slide/fade transitions between them. Detect via viewport width (e.g. `<768px`) and swap presentation components, same underlying `hardware.ts` data source for all three presentations (desktop scene, reduced-motion fallback, mobile sequence).

## 5G, Continuation Into the Rest of the Home Lab

- After the motherboard sequence ends (or after the mobile sequence, or after the spec sheet, all three converge back into the normal page flow here), continue with a standard (non-pinned) animated scroll section covering: monitors/peripherals, networking equipment, virtualization environment, guest OSes, dedicated practice/CTF VMs, and your Kali/XFCE environment callout (from the `os-environment` data seeded in Chapter 2).
- This continuation reuses the `<AnimatedReveal>` pattern from Chapter 1, it should feel like landing back in "normal" scroll rhythm after the cinematic sequence, a deliberate pacing contrast.

## 5H, Home Lab Route Assembly

- `app/homelab/page.tsx` assembles 5B, 5G in order.
- Update `HomeLabTeaser.tsx` on the home page (deferred since Chapter 1/3) with a real still frame from the scene and the working link.

---

## Acceptance Criteria for Chapter 5

- [ ] Scroll through the full motherboard sequence on desktop: smooth, correctly synced, no jank, on your actual dev machine.
- [ ] Every `HardwareComponent` from `hardware.ts` has a working stage with correct highlight, dim, and info panel.
- [ ] `SceneNavDots` allow full navigation without scrolling, and are keyboard-accessible.
- [ ] `prefers-reduced-motion: reduce` produces the static spec-sheet fallback, verified by actually toggling the OS/browser setting, not just code review.
- [ ] Mobile (test at 375 to 414px) uses the scroll-snap sequence, not a broken/degraded version of the desktop camera pan.
- [ ] The post-motherboard home lab continuation renders and reads well.
- [ ] `HomeLabTeaser` on the home page now links correctly and shows a real frame.

---

## Prompt to give Claude Code for this chapter

```
Read chapter-05-homelab-motherboard.md. This is the flagship, highest-effort
chapter, work through it in the lettered sub-stages (5A through 5H) as
separate checkpoints, confirming each stage works before moving to the next,
rather than attempting the whole scene at once.

Start with 5B using a placeholder colored-boxes SVG so we can validate the
scroll/camera/GSAP ScrollTrigger mechanics before investing in final art.
Use the hardware.ts data from Chapter 2 for stage content and IDs. Build the
prefers-reduced-motion fallback (5E) and mobile sequence (5F) as real,
well-designed alternatives, not afterthoughts, they share the same data
source as the desktop scene.

Stop and flag me explicitly if 5A (the actual motherboard SVG artwork) isn't
available yet rather than generating low-quality placeholder art and treating
it as final. Report against the Acceptance Criteria at the end.
```
