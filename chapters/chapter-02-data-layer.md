# Chapter 2 — Content Data Layer

**Goal of this chapter:** define every data shape the site needs and seed it with your real content, so every later chapter is wiring components to real data instead of inventing schemas on the fly.

**Prerequisites:** Chapter 0 and 1 complete.

**Decision made for you (revisit later if needed):** start with **typed local data (TypeScript objects / JSON in `/data`)** rather than standing up Supabase/Postgres immediately. Reasoning: you don't yet have enough content for a database to earn its complexity, and typed local data is trivially migrated to Drizzle+Supabase later (same shapes, different source). Stand up the real DB in a later "Chapter 2.5" only once you're actually adding content often enough that Git-committing JSON becomes annoying, or once you build an admin panel (future work, not in this plan).

---

## 2.1 Define These Types in `/lib/types.ts`

Copy these directly (from the master plan, consolidated in one place):

```ts
export type Skill = {
  id: string;
  name: string;
  category: "cybersecurity" | "networking" | "operating-systems" | "programming"
    | "web-development" | "tools" | "databases" | "version-control" | "cloud" | "virtualization";
  proficiency: "learning" | "comfortable" | "proficient";
  icon: string;
  note?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  logo: string;
  status: "earned" | "in-progress" | "planned";
  dateEarned?: string;
  credentialUrl?: string;
};

export type RoadmapItem = {
  id: string;
  title: string;
  category: string;
  status: "done" | "in-progress" | "planned";
  targetQuarter?: string;
  notes?: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: "ctf" | "competition" | "academic" | "community";
};

export type HardwareComponent = {
  id: string;
  name: string;
  category: "cpu" | "ram" | "gpu" | "storage" | "chipset" | "network" | "pcie" | "cooling" | "power";
  specs: string[];
  whyIChoseIt: string;
  upgradeHistory: string;
  currentPurpose: string;
  performanceNotes: string;
  personalExperience: string;
  futureUpgradePlans: string;
  sceneAnchor: { x: number; y: number; zoom: number };
};

export type JourneyMilestone = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export type EducationEntry = {
  id: string;
  program: string;
  institution: string;
  startDate: string;
  endDate?: string;
  coursework: string[];
};
```

(`Project` type is defined separately in Chapter 4 since it's MDX-backed, not plain data.)

## 2.2 Seed Files to Create in `/data/`

- `skills.ts` — your real skills, honestly leveled (don't inflate "learning" to "proficient").
- `certifications.ts` — real certs, including planned/in-progress ones with honest status.
- `roadmap.ts` — real done/doing/next items.
- `achievements.ts` — real achievements; if you don't have any yet, this file can be empty/near-empty — do not fabricate placeholder achievements as if real.
- `journey.ts` — real milestones in your path so far.
- `education.ts` — your real program/institution/coursework.
- `hardware.ts` — **pre-seeded from your actual machine specs**, use this as the starting content (fill in the `whyIChoseIt`/`personalExperience`/`futureUpgradePlans` fields yourself — the rest is accurate as given):

```ts
export const hardwareComponents: HardwareComponent[] = [
  {
    id: "cpu",
    name: "Intel Core i5-4670K",
    category: "cpu",
    specs: [
      "Haswell (4th Gen), x86_64",
      "4 physical cores / 4 threads",
      "Base 3.40GHz, turbo up to 3.80GHz, min 800MHz",
      "AVX supported, single NUMA node",
    ],
    whyIChoseIt: "", // your words
    upgradeHistory: "",
    currentPurpose: "",
    performanceNotes: "",
    personalExperience: "",
    futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 }, // real values set in Chapter 5
  },
  {
    id: "ram",
    name: "System Memory",
    category: "ram",
    specs: ["~9.6GB DDR3 total", "~6.6GB typically available", "5GB swap configured"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
  {
    id: "gpu-integrated",
    name: "Intel HD Graphics 4600",
    category: "gpu",
    specs: ["Integrated, i915 driver"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
  {
    id: "gpu-dedicated",
    name: "NVIDIA GeForce GT 710",
    category: "gpu",
    specs: ["Fermi GK208B, dedicated", "NVIDIA proprietary driver 470.256.02", "CUDA 11.4"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
  {
    id: "storage-ssd",
    name: "Samsung SSD 840 (112GB)",
    category: "storage",
    specs: ["SATA SSD, mostly unused capacity"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
  {
    id: "storage-hdd-1",
    name: "Hitachi HDP7250 (149GB)",
    category: "storage",
    specs: ["Mechanical HDD"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
  {
    id: "storage-hdd-2",
    name: "2x Seagate ST500DM002 (~931GB combined)",
    category: "storage",
    specs: ["Boot drive among this pair", "90GB ext4 root partition, ~32% used"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
  {
    id: "network",
    name: "Onboard Networking",
    category: "network",
    specs: ["Ethernet (eth0) — active", "WiFi (wlan0) — present, currently down"],
    whyIChoseIt: "", upgradeHistory: "", currentPurpose: "",
    performanceNotes: "", personalExperience: "", futureUpgradePlans: "",
    sceneAnchor: { x: 0, y: 0, zoom: 1 },
  },
];
```

Also seed `os-environment.ts` (or fold into an `Achievements`/`About`-adjacent data point) capturing: Kali Linux Rolling, XFCE desktop, X11/LightDM, Zsh shell — this is a strong signal for the security identity and deserves its own callout card, not just a spec-sheet line.

## 2.3 Data-Access Layer

- `/lib/data.ts`: thin typed getter functions (`getSkills()`, `getCertifications()`, etc.) — even though these just return the local arrays today, routing all component data-fetching through these functions means swapping to a real DB later only touches this one file, nothing downstream.

---

## Acceptance Criteria for Chapter 2

- [ ] Every type in 2.1 exists in `/lib/types.ts` with no `any`.
- [ ] Every seed file in 2.2 exists with real (not placeholder) content, except achievements if genuinely empty.
- [ ] `/lib/data.ts` getters exist and are what components will import (never import `/data/*` directly from a component).
- [ ] No section built in Chapter 1 has been rewired to this data yet — that happens per-section as you rebuild each one in later chapters. This chapter is data-only.

---

## Prompt to give Claude Code for this chapter

```
Read chapter-02-data-layer.md and implement everything in it. Create the
types in /lib/types.ts exactly as specified, the seed data files in /data/
(using the real hardware specs given in 2.2 verbatim for the factual fields,
leaving the narrative fields like whyIChoseIt as empty strings for me to
fill in personally — do not invent personal narrative content on my behalf),
and the typed getter functions in /lib/data.ts.

Do not rewire any existing Chapter 1 section components to use this data
yet — that happens in later chapters. This chapter only creates the data
layer. When done, report against the Acceptance Criteria.
```
