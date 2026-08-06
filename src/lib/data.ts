/**
 * Data access layer — all components import from here, never from /data/* directly.
 * Swapping to a real DB later only changes this file.
 */

// ── Skills ──────────────────────────────────────────────────
import { skills } from "@/data/skills";

export function getSkills() {
  return skills;
}

export function getSkillsByCategory(category: string) {
  return skills.filter((s) => s.category === category);
}

export function getSkillProficiencies() {
  return {
    learning: skills.filter((s) => s.proficiency === "learning"),
    comfortable: skills.filter((s) => s.proficiency === "comfortable"),
    proficient: skills.filter((s) => s.proficiency === "proficient"),
  } as const;
}

// ── Certifications ──────────────────────────────────────────
import { certifications } from "@/data/certifications";

export function getCertifications() {
  return certifications;
}

export function getCertificationsByStatus(status: string) {
  return certifications.filter((c) => c.status === status);
}

// ── Roadmap ─────────────────────────────────────────────────
import { roadmapItems } from "@/data/roadmap";

export function getRoadmap() {
  return roadmapItems;
}

export function getRoadmapByStatus(status: string) {
  return roadmapItems.filter((r) => r.status === status);
}

// ── Achievements ────────────────────────────────────────────
import { achievements } from "@/data/achievements";

export function getAchievements() {
  return achievements;
}

// ── Hardware ────────────────────────────────────────────────
import { hardwareComponents } from "@/data/hardware";

export function getHardware() {
  return hardwareComponents;
}

export function getHardwareByCategory(category: string) {
  return hardwareComponents.filter((h) => h.category === category);
}

// ── Journey ─────────────────────────────────────────────────
import { journeyMilestones } from "@/data/journey";

export function getJourney() {
  return journeyMilestones;
}

// ── Education ───────────────────────────────────────────────
import { educationEntries } from "@/data/education";

export function getEducation() {
  return educationEntries;
}

// ── Contact ─────────────────────────────────────────────────
import { contactInfo } from "@/data/contact";

export function getContactInfo() {
  return contactInfo;
}

// ── OS Environment ──────────────────────────────────────────
import { osEnvironment } from "@/data/os-environment";

export function getOsEnvironment() {
  return osEnvironment;
}

// ── Tech Stack ──────────────────────────────────────────────
import { toolGroups } from "@/data/tech-stack";

export function getTechStack() {
  return toolGroups;
}

// ── About ───────────────────────────────────────────────────
import { bio, interests } from "@/data/about";

export function getAbout() {
  return { bio, interests };
}
