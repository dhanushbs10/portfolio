import type { Skill } from "@/lib/types";

export const skills: Skill[] = [
  // ── Programming ──────────────────────────────────────────
  { id: "skill-c", name: "C", category: "programming", proficiency: "comfortable", icon: "code" },
  { id: "skill-python", name: "Python", category: "programming", proficiency: "comfortable", icon: "code" },
  { id: "skill-js", name: "JavaScript", category: "programming", proficiency: "comfortable", icon: "code" },
  { id: "skill-html", name: "HTML", category: "programming", proficiency: "proficient", icon: "code" },
  { id: "skill-css", name: "CSS", category: "programming", proficiency: "proficient", icon: "code" },
  { id: "skill-ts", name: "TypeScript", category: "programming", proficiency: "learning", icon: "code", note: "Currently learning" },

  // ── Web Development ──────────────────────────────────────
  { id: "skill-react", name: "React", category: "web-development", proficiency: "comfortable", icon: "layout" },
  { id: "skill-nextjs", name: "Next.js", category: "web-development", proficiency: "comfortable", icon: "layout" },
  { id: "skill-tailwind", name: "Tailwind CSS", category: "web-development", proficiency: "proficient", icon: "palette" },
  { id: "skill-nodejs", name: "Node.js", category: "web-development", proficiency: "comfortable", icon: "server" },
  { id: "skill-git", name: "Git", category: "version-control", proficiency: "proficient", icon: "git-branch" },
  { id: "skill-github", name: "GitHub", category: "version-control", proficiency: "proficient", icon: "github" },

  // ── Cybersecurity ────────────────────────────────────────
  { id: "skill-linux", name: "Linux", category: "operating-systems", proficiency: "proficient", icon: "terminal" },
  { id: "skill-kali", name: "Kali Linux", category: "cybersecurity", proficiency: "comfortable", icon: "shield" },
  { id: "skill-wireshark", name: "Wireshark", category: "tools", proficiency: "comfortable", icon: "activity" },
  { id: "skill-nmap", name: "Nmap", category: "tools", proficiency: "comfortable", icon: "radar" },
  { id: "skill-burpsuite", name: "Burp Suite", category: "tools", proficiency: "comfortable", icon: "shield" },
  { id: "skill-metasploit", name: "Metasploit", category: "tools", proficiency: "learning", icon: "shield", note: "Currently learning" },
  { id: "skill-owasp", name: "OWASP Fundamentals", category: "cybersecurity", proficiency: "comfortable", icon: "book-open" },
  { id: "skill-vuln-assessment", name: "Vulnerability Assessment", category: "cybersecurity", proficiency: "learning", icon: "alert-triangle", note: "Actively studying" },

  // ── Networking ───────────────────────────────────────────
  { id: "skill-tcpip", name: "TCP/IP", category: "networking", proficiency: "proficient", icon: "network" },
  { id: "skill-dns", name: "DNS", category: "networking", proficiency: "comfortable", icon: "server" },
  { id: "skill-dhcp", name: "DHCP", category: "networking", proficiency: "comfortable", icon: "server" },
  { id: "skill-routing", name: "Routing", category: "networking", proficiency: "comfortable", icon: "git-merge" },
  { id: "skill-switching", name: "Switching", category: "networking", proficiency: "comfortable", icon: "toggle-left" },
  { id: "skill-vlan", name: "VLAN Concepts", category: "networking", proficiency: "learning", icon: "layers", note: "Studying for CCNA" },
  { id: "skill-packet-tracer", name: "Cisco Packet Tracer", category: "networking", proficiency: "comfortable", icon: "box" },

  // ── Operating Systems ────────────────────────────────────
  { id: "skill-win10", name: "Windows 10", category: "operating-systems", proficiency: "proficient", icon: "monitor" },
  { id: "skill-win11", name: "Windows 11", category: "operating-systems", proficiency: "proficient", icon: "monitor" },
  { id: "skill-ubuntu", name: "Ubuntu", category: "operating-systems", proficiency: "comfortable", icon: "terminal" },
];
