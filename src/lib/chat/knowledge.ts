import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import type { Chunk } from "./retrieval";

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function chunk(
  id: string,
  source: string,
  title: string,
  text: string
): Chunk {
  return { id, source, title, section: null, text: clean(text) };
}

const chunks: Chunk[] = [
  chunk(
    "id-01",
    "profile",
    "Identity",
    `Dhanush B S, based in Bengaluru, India.`,
  ),
  chunk(
    "id-02",
    "profile",
    "Current identity",
    `Diploma Computer Science and Engineering student. Describes himself as a newbie tech guy who is very curious about technology and kind of a jack of all trades, master of none. Strongest traits are breadth, curiosity, fast learning and practical experimentation.`,
  ),
  chunk(
    "id-03",
    "profile",
    "Role and focus",
    `Role: Cybersecurity & Networking Student. Focus areas: Cybersecurity, Networking, Infrastructure. Status: Diploma CSE, Semester 5, open to internships.`,
  ),
  chunk(
    "id-04",
    "profile",
    "Bio",
    `Building reliable systems and securing networks, from bare-metal infrastructure to practical cybersecurity labs. Strongest interests are hardware troubleshooting and deep system understanding, paired with cybersecurity and networking. Long-term goal is a Network Engineering career, building toward CCNA/Cisco certification. Learns by doing: curious, practical, hands-on across electronics, robotics, Linux, programming and web development.`,
  ),
];

function profileChunks(): Chunk[] {
  const out: Chunk[] = [];
  const education = profile.education
    .map((e) => `${e.school} (${e.place}, ${e.period}). ${e.points.join(" ")}`)
    .join(" ");
  out.push(chunk("pf-edu", "profile", "Education", `Education: ${education}`));

  const interests = profile.interests
    .map((i) => `${i.title}: ${i.desc}`)
    .join(" ");
  out.push(chunk("pf-int", "profile", "Technical interests", interests));

  const skills = profile.coreSkills
    .map((s) => `${s.title}: ${s.tools.join(", ")}`)
    .join("; ");
  out.push(chunk("pf-skl", "profile", "Core skills", `Core skills: ${skills}`));

  out.push(chunk("pf-cert", "profile", "Certifications", `Certifications: ${profile.certifications.map((c) => `${c.org}: ${c.title} (${c.status})`).join("; ")}`));

  out.push(
    chunk("pf-road", "profile", "Roadmap", `Roadmap. Done: ${profile.roadmap.done.join("; ")}. Doing: ${profile.roadmap.doing.join("; ")}. Next: ${profile.roadmap.next.join("; ")}.`),
  );

  out.push(
    chunk("pf-journey", "profile", "Journey timeline", `Journey: ${profile.journey.map((j) => `${j.period} - ${j.title} (${j.org}): ${j.desc}`).join(" | ")}`),
  );

  out.push(
    chunk("pf-links", "profile", "Public links", `GitHub ${profile.contact.github}, LinkedIn ${profile.contact.linkedin}. Location: ${profile.location}.`),
  );

  out.push(
    chunk("pf-status", "profile", "Current status", `Current status: ${profile.status}. Located in ${profile.location}.`),
  );

  return out;
}

function projectChunks(): Chunk[] {
  const out: Chunk[] = [];
  const overview = projects.map((p) => `${p.title} (${p.category}): ${p.tagline}`).join(" | ");
  out.push(chunk("pr-overview", "projects", "All projects overview", overview));
  for (const p of projects) {
    out.push(
      chunk(`pr-${p.slug}-main`, "projects", p.title, `${p.title} (${p.category}). ${p.description}. Stack: ${p.stack.join(", ")}. Source: ${p.github}.`),
    );
    out.push(
      chunk(`pr-${p.slug}-meta`, "projects", `${p.title} details`, `${p.title}. Features: ${p.features.join(" | ")}. ${p.extraLink ? `Extra links: ${p.extraLink.label} at ${p.extraLink.href}. ` : ""}${p.disclaimer ? `Disclaimer: ${p.disclaimer}` : ""}`),
    );
  }
  return out;
}

export const knowledge: Chunk[] = [
  ...chunks,
  ...profileChunks(),
  ...projectChunks(),
];
