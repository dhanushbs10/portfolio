// Shared tool → Simple Icons slug + brand color + official URL

export interface ToolMeta {
  slug: string;
  color: string;
  url: string;
}

export const TOOL_ICONS: Record<string, ToolMeta> = {
  React: { slug: "si-react", color: "#61DAFB", url: "https://react.dev" },
  "Next.js": { slug: "si-nextdotjs", color: "#E8E8E8", url: "https://nextjs.org" },
  "Tailwind CSS": {
    slug: "si-tailwindcss",
    color: "#06B6D4",
    url: "https://tailwindcss.com",
  },
  "Node.js": { slug: "si-nodedotjs", color: "#5FA04E", url: "https://nodejs.org" },
  Git: { slug: "si-git", color: "#F03C2E", url: "https://git-scm.com" },
  GitHub: { slug: "si-github", color: "#E8E8E8", url: "https://github.com" },
  TypeScript: {
    slug: "si-typescript",
    color: "#3178C6",
    url: "https://www.typescriptlang.org",
  },
  Python: {
    slug: "si-python",
    color: "#3776AB",
    url: "https://www.python.org",
  },
  JavaScript: {
    slug: "si-javascript",
    color: "#F7DF1E",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  HTML: {
    slug: "si-html5",
    color: "#E34F26",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  "HTML5": {
    slug: "si-html5",
    color: "#E34F26",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  CSS: {
    slug: "si-css",
    color: "#663399",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  "CSS3": {
    slug: "si-css",
    color: "#663399",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  C: {
    slug: "si-c",
    color: "#A8B9CC",
    url: "https://en.wikipedia.org/wiki/C_(programming_language)",
  },
  Linux: { slug: "si-linux", color: "#FCC624", url: "https://www.linux.org" },
  "Kali Linux": {
    slug: "si-kalilinux",
    color: "#557C94",
    url: "https://www.kali.org",
  },
  Ubuntu: { slug: "si-ubuntu", color: "#E95420", url: "https://ubuntu.com" },
  Wireshark: {
    slug: "si-wireshark",
    color: "#1679A7",
    url: "https://www.wireshark.org",
  },
  "Burp Suite": {
    slug: "si-burpsuite",
    color: "#FF6633",
    url: "https://portswigger.net/burp",
  },
  Metasploit: {
    slug: "si-metasploit",
    color: "#2596CD",
    url: "https://www.metasploit.com",
  },
  Windows: {
    slug: "si-microsoft",
    color: "#0078D4",
    url: "https://www.microsoft.com/windows",
  },
  Nmap: { slug: "si-nmap", color: "#7A5FFF", url: "https://nmap.org" },
  // Project-specific
  Networking: { slug: "si-cisco", color: "#1BA0D7", url: "https://www.cisco.com" },
  "TCP/IP": {
    slug: "si-tcpdump",
    color: "#E55E2D",
    url: "https://www.tcpdump.org",
  },
  Subnetting: { slug: "si-cisco", color: "#1BA0D7", url: "https://www.cisco.com" },
  SMB: { slug: "si-windows", color: "#0078D4", url: "https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-overview" },
  DHCP: { slug: "si-ubiquiti", color: "#0057B8", url: "https://www.ubnt.com" },
  "Windows Networking": {
    slug: "si-windows",
    color: "#0078D4",
    url: "https://learn.microsoft.com/en-us/windows-server/networking",
  },
  Troubleshooting: {
    slug: "si-debian",
    color: "#A81D33",
    url: "https://www.debian.org",
  },
  "Wake-on-LAN": {
    slug: "si-intel",
    color: "#0071C5",
    url: "https://www.intel.com",
  },
  "Embedded Systems": {
    slug: "si-arduino",
    color: "#00979D",
    url: "https://www.arduino.cc",
  },
  ESP8266: { slug: "si-espressif", color: "#E7352C", url: "https://www.espressif.com" },
  "PXE Boot": { slug: "si-linux", color: "#FCC624", url: "https://www.linux.org" },
  TFTP: { slug: "si-linux", color: "#FCC624", url: "https://www.linux.org" },
  "Web Development": {
    slug: "si-javascript",
    color: "#F7DF1E",
    url: "https://developer.mozilla.org/en-US/docs/Web",
  },
  "Computer Networks": {
    slug: "si-cisco",
    color: "#1BA0D7",
    url: "https://www.cisco.com",
  },
  "Operating Systems": {
    slug: "si-linux",
    color: "#FCC624",
    url: "https://www.linux.org",
  },
  "Database Management": {
    slug: "si-postgresql",
    color: "#4169E1",
    url: "https://www.postgresql.org",
  },
  "Web Technologies": {
    slug: "si-javascript",
    color: "#F7DF1E",
    url: "https://developer.mozilla.org/en-US/docs/Web",
  },
  "Cybersecurity Fundamentals": {
    slug: "si-kalilinux",
    color: "#557C94",
    url: "https://www.kali.org",
  },
  "Data Structures": {
    slug: "si-python",
    color: "#3776AB",
    url: "https://www.python.org",
  },
  "Network Security": {
    slug: "si-cisco",
    color: "#1BA0D7",
    url: "https://www.cisco.com",
  },
  Cryptography: {
    slug: "si-openssl",
    color: "#721403",
    url: "https://www.openssl.org",
  },
  "Software Engineering": {
    slug: "si-git",
    color: "#F03C2E",
    url: "https://git-scm.com",
  },
  "Mobile Computing": {
    slug: "si-android",
    color: "#3DDC84",
    url: "https://developer.android.com",
  },
  FLAC: { slug: "si-audacity", color: "#0000FF", url: "https://www.audacityteam.org" },
  OTA: { slug: "si-arduino", color: "#00979D", url: "https://www.arduino.cc" },
  Firmware: {
    slug: "si-arduino",
    color: "#00979D",
    url: "https://www.arduino.cc",
  },
  "i2C LCD": {
    slug: "si-arduino",
    color: "#00979D",
    url: "https://www.arduino.cc",
  },
  GRUB: { slug: "si-gnu", color: "#A42E2B", url: "https://www.gnu.org/software/grub" },
  DualBoot: { slug: "si-linux", color: "#FCC624", url: "https://www.linux.org" },
  Waydroid: {
    slug: "si-android",
    color: "#3DDC84",
    url: "https://waydro.id",
  },
  Anbox: { slug: "si-android", color: "#3DDC84", url: "https://anbox.io" },
  Minecraft: {
    slug: "si-minecraft",
    color: "#62B47A",
    url: "https://www.minecraft.net",
  },
  Fabric: {
    slug: "si-fabric",
    color: "#8B5CF6",
    url: "https://fabricmc.net",
  },
  Aternos: {
    slug: "si-aternos",
    color: "#6B7280",
    url: "https://aternos.org",
  },
  Mods: { slug: "si-minecraft", color: "#62B47A", url: "https://www.minecraft.net" },
  "Minecraft Server": {
    slug: "si-minecraft",
    color: "#62B47A",
    url: "https://www.minecraft.net",
  },
};

// Tools shown in the TechStack marquee — core languages, frameworks, platforms
export interface StackTool extends ToolMeta {
  name: string;
}
export const TECH_STACK_TOOLS: StackTool[] = [
  { slug: "si-react", color: "#61DAFB", url: "https://react.dev", name: "React" },
  { slug: "si-nextdotjs", color: "#E8E8E8", url: "https://nextjs.org", name: "Next.js" },
  { slug: "si-tailwindcss", color: "#06B6D4", url: "https://tailwindcss.com", name: "Tailwind CSS" },
  { slug: "si-nodedotjs", color: "#5FA04E", url: "https://nodejs.org", name: "Node.js" },
  { slug: "si-git", color: "#F03C2E", url: "https://git-scm.com", name: "Git" },
  { slug: "si-github", color: "#E8E8E8", url: "https://github.com", name: "GitHub" },
  { slug: "si-typescript", color: "#3178C6", url: "https://www.typescriptlang.org", name: "TypeScript" },
  { slug: "si-javascript", color: "#F7DF1E", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", name: "JavaScript" },
  { slug: "si-python", color: "#3776AB", url: "https://www.python.org", name: "Python" },
  { slug: "si-html5", color: "#E34F26", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", name: "HTML5" },
  { slug: "si-css", color: "#663399", url: "https://developer.mozilla.org/en-US/docs/Web/CSS", name: "CSS3" },
  { slug: "si-c", color: "#A8B9CC", url: "https://en.wikipedia.org/wiki/C_(programming_language)", name: "C" },
  { slug: "si-linux", color: "#FCC624", url: "https://www.linux.org", name: "Linux" },
  { slug: "si-wireshark", color: "#1679A7", url: "https://www.wireshark.org", name: "Wireshark" },
  { slug: "si-burpsuite", color: "#FF6633", url: "https://portswigger.net/burp", name: "Burp Suite" },
  { slug: "si-metasploit", color: "#2596CD", url: "https://www.metasploit.com", name: "Metasploit" },
];

export function getToolMeta(name: string): ToolMeta | undefined {
  return TOOL_ICONS[name];
}