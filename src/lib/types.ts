/**
 * All shared data types for the portfolio.
 * Used by /data/ seed files and /lib/data.ts getters.
 */

// ── Skills ──────────────────────────────────────────────────
export type SkillCategory =
  | "cybersecurity"
  | "networking"
  | "operating-systems"
  | "programming"
  | "web-development"
  | "tools"
  | "databases"
  | "version-control"
  | "cloud"
  | "virtualization";

export type SkillProficiency = "learning" | "comfortable" | "proficient";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
  icon: string;
  note?: string;
}

// ── Certifications ──────────────────────────────────────────
export type CertificationStatus = "earned" | "in-progress" | "planned";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  logo: string;
  status: CertificationStatus;
  dateEarned?: string;
  credentialUrl?: string;
}

// ── Roadmap ─────────────────────────────────────────────────
export type RoadmapStatus = "done" | "in-progress" | "planned";

export interface RoadmapItem {
  id: string;
  title: string;
  category: string;
  status: RoadmapStatus;
  targetQuarter?: string;
  notes?: string;
}

// ── Achievements ────────────────────────────────────────────
export type AchievementCategory = "ctf" | "competition" | "academic" | "community";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: AchievementCategory;
}

// ── Hardware (Homelab) ──────────────────────────────────────
export type HardwareCategory =
  | "cpu"
  | "ram"
  | "gpu"
  | "storage"
  | "chipset"
  | "network"
  | "pcie"
  | "cooling"
  | "power";

export interface HardwareComponent {
  id: string;
  name: string;
  category: HardwareCategory;
  specs: string[];
  whyIChoseIt: string;
  upgradeHistory: string;
  currentPurpose: string;
  performanceNotes: string;
  personalExperience: string;
  futureUpgradePlans: string;
  sceneAnchor: { x: number; y: number; zoom: number };
}

// ── Journey / Experience ────────────────────────────────────
export interface JourneyMilestone {
  id: string;
  title: string;
  role: string;
  org: string;
  date: string;
  description: string;
}

// ── Education ───────────────────────────────────────────────
export interface EducationEntry {
  id: string;
  program: string;
  institution: string;
  startDate: string;
  endDate?: string;
  coursework: string[];
}

// ── Contact ─────────────────────────────────────────────────
export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  socials: SocialLink[];
}
