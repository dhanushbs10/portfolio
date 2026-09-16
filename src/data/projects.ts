// Every fact below is taken from the project's own README.
// Nothing is invented: IPs, commands, tables and flows are quoted from source.

export type SpecTable = { head: [string, string]; rows: [string, string][] };

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: "Security" | "Networking" | "Systems" | "Web";
  tagline: string;
  description: string;
  stack: string[];
  github: string;
  extraLink?: { label: string; href: string };
  features: string[];
  flow: { step: string; title: string; detail: string }[];
  tables: { title: string; note?: string; table: SpecTable }[];
  code?: { title: string; lang: string; body: string }[];
  build: string[];
  disclaimer?: string;
};

export const projects: Project[] = [
  {
    slug: "phantomsection",
    index: "01",
    title: "PhantomSection",
    category: "Security",
    tagline: "C++ shellcode loader - PEB walking, EAT parsing, ETW patching.",
    description:
      "PhantomSection is a C++ shellcode loader that combines PEB walking, Export Address Table (EAT) parsing, and ETW patching to evade userland API hooking and telemetry. Payloads are staged and XOR-encrypted to bypass static signature analysis.",
    stack: ["C++", "Win32 API", "PEB Walking", "EAT Parsing", "ETW Patching", "XOR 0x55", "msfvenom", "Python", "PowerShell", "Visual Studio"],
    github: "https://github.com/dhanushbs10/PhantomSection",
    features: [
      "API unhooking via PEB walking - no GetModuleHandle",
      "Manual function resolution via EAT parsing - no GetProcAddress",
      "Telemetry blinding via ETW patching (EtwEventWrite → xor rax, rax; ret)",
      "Runtime XOR payload decryption, staged separately as payload.bin",
    ],
    flow: [
      { step: "01", title: "Loader starts", detail: "Executable starts with no suspicious imports - no GetModuleHandle, no GetProcAddress." },
      { step: "02", title: "PEB traversal", detail: "Walks InMemoryOrderModuleList to locate kernel32.dll and ntdll.dll base addresses." },
      { step: "03", title: "EAT parsing", detail: "Parses Export Address Tables from PE headers to resolve VirtualAlloc and VirtualProtect manually." },
      { step: "04", title: "ETW patch", detail: "Overwrites the EtwEventWrite prologue in ntdll.dll with a direct return before injection." },
      { step: "05", title: "Stage payload", detail: "Reads XOR-encrypted payload.bin (key 0x55) from disk into a local buffer." },
      { step: "06", title: "Decrypt + execute", detail: "Decrypts in memory, allocates RWX via resolved VirtualAlloc, copies and executes via function pointer." },
    ],
    tables: [
      {
        title: "MITRE ATT&CK mapping",
        table: {
          head: ["Technique", "Description"],
          rows: [
            ["T1106 · Native API", "Manual function resolution"],
            ["T1562.001 · Impair Defenses", "Disable or modify tools (ETW patching)"],
            ["T1027 · Obfuscated Files", "XOR decryption"],
            ["T1055.001 · Process Injection", "Dynamic invocation"],
          ],
        },
      },
    ],
    code: [
      {
        title: "Payload generation (Kali)",
        lang: "bash",
        body: "msfvenom -p windows/x64/exec CMD=calc.exe -f raw -o raw.bin\npython3 encrypt.py raw.bin",
      },
      {
        title: "Payload encryption (Windows)",
        lang: "powershell",
        body: "powershell -ExecutionPolicy Bypass -File .\\encrypt.ps1 -InputFile .\\raw.bin",
      },
    ],
    build: [
      "Prerequisites: Visual Studio (Desktop C++ workload); Kali with msfvenom + Python, or PowerShell",
      "msfvenom -p windows/x64/exec CMD=calc.exe -f raw -o raw.bin",
      "python3 encrypt.py raw.bin  →  payload.bin",
      "New C++ Console App (x64) → replace main .cpp → compile Release/x64",
      "Place PhantomSection.exe + payload.bin together → execute",
    ],
    disclaimer:
      "Educational and defensive-research purposes only - to understand how threat actors operate so defenders can build better telemetry and mitigations.",
  },
  {
    slug: "droplink",
    index: "02",
    title: "DropLink",
    category: "Security",
    tagline: "Secure peer-to-peer file and text transfer - WebRTC + AES-256-GCM.",
    description:
      "DropLink uses WebRTC for direct browser-to-browser connections and AES-256-GCM end-to-end encryption. No file data ever touches a server. Transfers run entirely between the two participants; the signaling server only coordinates the initial handshake.",
    stack: ["Next.js 16", "React 19", "TypeScript 5", "Tailwind CSS 3", "WebRTC DataChannels", "Socket.io 4", "Supabase", "PostgreSQL", "Radix UI"],
    github: "https://github.com/dhanushbs10/droplink",
    features: [
      "Guest mode - start a transfer immediately without an account",
      "Optional accounts - history and one-click reconnect to buddies",
      "AES-256-GCM over WebRTC DataChannels; key derived from a share token via HKDF-SHA256",
      "Text, code and password sharing with syntax highlighting + auto-copy",
      "Folder uploads - recursive drag-and-drop with per-file progress",
      "Auto-resume on interruption; QR-code join; clipboard sync",
      "ICE-restart auto-reconnect; signaling rate-limited at 30/IP/min",
    ],
    flow: [
      { step: "01", title: "Create room", detail: "Sender clicks Create Room → signaling server (server/index.ts) assigns a room code." },
      { step: "02", title: "Share link", detail: "Sender shares link (room code + share token). The share token is never sent to the server." },
      { step: "03", title: "Join + handshake", detail: "Receiver joins via signaling; peers exchange SDP offers/answers and ICE candidates." },
      { step: "04", title: "Encrypted channel", detail: "AES-256-GCM key derived from the share token (HKDF-SHA256). All control messages and chunks encrypted - server sees ciphertext only." },
    ],
    tables: [
      {
        title: "Architecture - three pieces",
        table: {
          head: ["Piece", "Role"],
          rows: [
            ["Next.js frontend", "Send, Receive, Share Dashboard, landing. Vercel or any Node host."],
            ["Socket.io signaling", "Relays SDP + ICE only. Never sees payloads. Render / Fly.io / Railway."],
            ["Supabase", "PostgreSQL + Auth (password, magic link, OAuth) + RLS. Profiles, buddies, on_auth_user_created trigger."],
          ],
        },
      },
      {
        title: "Environment variables",
        note: "From .env.example - copy to .env.local",
        table: {
          head: ["Variable", "Purpose"],
          rows: [
            ["NEXT_PUBLIC_SITE_URL", "Public frontend URL for canonical + OG"],
            ["NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL"],
            ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase anon key"],
            ["NEXT_PUBLIC_SIGNALING_URL", "Signaling host (localhost:3001 locally)"],
            ["SIGNALING_PORT", "Server port, default 3001"],
            ["SIGNALING_ORIGINS", "Allowed origins in production"],
          ],
        },
      },
    ],
    code: [
      {
        title: "Run it locally",
        lang: "bash",
        body: "npm install\ncp .env.example .env.local\nnpm run dev:server   # :3001\nnpm run dev            # :3000 (or both via concurrently)",
      },
    ],
    build: [
      "Prerequisites: Node.js 20+, npm, a Supabase project, the included server/index.ts",
      "npm install && cp .env.example .env.local (fill 6 variables)",
      "Supabase SQL Editor → run supabase/schema.sql (profiles, buddies, RLS, trigger)",
      "npm run dev:server  →  http://localhost:3001",
      "npm run dev  →  http://localhost:3000",
      "Verify: two tabs, create room in one, open share link in the other",
    ],
  },
  {
    slug: "vynlore",
    index: "03",
    title: "Vynlore",
    category: "Systems",
    tagline: "Lossless-first desktop music player - Tauri v2, React, Rust.",
    description:
      "A local music player designed for audiophiles who care about playback quality. It decodes all major formats natively in Rust, outputs through WASAPI exclusive mode for bit-perfect delivery, and ships with a 10-band parametric equalizer with genre-aware presets.",
    stack: ["Rust", "Tauri v2", "React 19", "TypeScript", "Tailwind v4", "Vite", "Symphonia", "CPAL", "WASAPI"],
    github: "https://github.com/dhanushbs10/vynlore",
    extraLink: { label: "Releases", href: "https://github.com/dhanushbs10/vynlore/releases" },
    features: [
      "Gapless playback with crossfade; WASAPI exclusive bit-perfect output",
      "10 formats decoded natively: FLAC, WAV, AIFF, MP3, M4A, OGG, WMA, APE, WavPack, DSD",
      "10-band parametric EQ with adjustable Q, shelf filters, preamp gain",
      "Auto-EQ: parse AutoEq profile text files into correction curves",
      "10 genre presets: Rock, Jazz, Classical, Electronic, Hip-Hop, Acoustic, Metal, Pop, R&B, Folk",
      "Library: folder watching, smart suggestions, playlists, likes, play counts",
      "Fullscreen now-playing with synced lyrics; Ctrl+K search; queue reorder; media keys",
    ],
    flow: [
      { step: "01", title: "Decode in Rust", detail: "Symphonia decodes the file natively - no system codecs involved." },
      { step: "02", title: "Shape the signal", detail: "Real-time EQ via biquad filters: 10 parametric bands + shelves + preamp." },
      { step: "03", title: "Bit-perfect output", detail: "CPAL pushes audio through WASAPI exclusive mode to the selected device." },
      { step: "04", title: "Library + interface", detail: "React frontend: watching, search palette, queue, now-playing, file association." },
    ],
    tables: [
      {
        title: "Supported formats",
        table: {
          head: ["Format", "Type"],
          rows: [
            ["FLAC · .flac", "Lossless"],
            ["WAV · .wav, .wave", "Lossless"],
            ["AIFF · .aiff, .aif", "Lossless"],
            ["APE · .ape / WavPack · .wv / DSD · .dsf, .dff", "Lossless"],
            ["MP3 · .mp3 / M4A · .m4a, .m4b / OGG · .ogg, .oga, .opus / WMA · .wma", "Lossy"],
          ],
        },
      },
      {
        title: "Downloads",
        table: {
          head: ["Platform", "Installer"],
          rows: [
            ["Windows", ".exe (NSIS) - then set as default player in Settings"],
            ["macOS", ".dmg"],
            ["Linux", ".deb, .AppImage"],
          ],
        },
      },
    ],
    code: [
      {
        title: "Develop",
        lang: "bash",
        body: "git clone https://github.com/dhanushbs10/vynlore.git\ncd vynlore && npm install\nnpx tauri dev      # needs Node 18+, Rust stable, Tauri CLI\nnpx tauri build    # installers → src-tauri/target/release/bundle/",
      },
    ],
    build: [
      "Prerequisites: Node.js 18+, Rust stable, Tauri CLI",
      "git clone https://github.com/dhanushbs10/vynlore.git && cd vynlore && npm install",
      "npx tauri dev  →  development window",
      "npx tauri build  →  src-tauri/target/release/bundle/",
    ],
  },
  {
    slug: "shellplay",
    index: "04",
    title: "ShellPlay",
    category: "Web",
    tagline: "Browser Linux terminal - 100+ commands, in-memory filesystem.",
    description:
      "A fully functional browser-based Linux terminal simulator with 100+ commands, a full shell script interpreter, and a virtual filesystem. All state lives in memory only - when you close the browser, everything is wiped clean.",
    stack: ["Next.js 16", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/dhanushbs10/ShellPlay",
    features: [
      "100+ commands: navigation, files, text processing, system info, processes, networking, users",
      "Command catalog modal - 40+ commands across 9 categories, click to autofill",
      "Bash interpreter: variables, loops, conditionals, functions, substitution, pipes, redirection",
      "In-memory VFS with permissions, ownership, timestamps - zero disk I/O",
      "Green (#00ff88) / amber (#ffb700) themes on #0d0d0d; history, tab-complete, help overlay",
    ],
    flow: [
      { step: "01", title: "Type", detail: "Input with history (↑↓), tab autocomplete and live descriptions - prompt user@linux-sim:/path$" },
      { step: "02", title: "Execute", detail: "CommandExecutor (50+ implementations) parses args, operates on the VFS, returns formatted output." },
      { step: "03", title: "Script", detail: "ShellInterpreter runs bash scripts with variables, loops and conditionals." },
      { step: "04", title: "Isolate", detail: "Everything in memory - close the tab and the whole machine evaporates." },
    ],
    tables: [
      {
        title: "Seeded filesystem",
        table: {
          head: ["Path", "Contents"],
          rows: [
            ["/home/user/", "documents/, downloads/, README.txt"],
            ["/etc/", "passwd (full user list), hostname"],
            ["/var/log/", "syslog (kernel logs)"],
            ["/proc/", "cpuinfo (Core i5), meminfo (8 GB)"],
            ["/tmp, /bin, /usr/bin", "scratch space, bash, sh, utilities"],
          ],
        },
      },
      {
        title: "Documented limits",
        table: {
          head: ["Area", "Status"],
          rows: [
            ["Network commands", "Simulated - no real network access"],
            ["Processes", "Simulated ps/top data"],
            ["Scripting", "Simplified core features"],
            ["Persistence", "None - memory only"],
          ],
        },
      },
    ],
    code: [
      {
        title: "Run it",
        lang: "bash",
        body: "pnpm install   # or npm install\npnpm dev       # → http://localhost:3000\npnpm build && pnpm start",
      },
    ],
    build: [
      "Prerequisites: Node.js 18+, pnpm/npm/yarn",
      "pnpm install",
      "pnpm dev  →  http://localhost:3000",
      "Pure TypeScript engine - no external dependencies for FS/commands",
    ],
  },
  {
    slug: "pxe-network-boot-lab",
    index: "05",
    title: "PXE Network Boot Lab",
    category: "Networking",
    tagline: "Diskless Linux boot - DHCP options 66/67 + TFTP + pxelinux.0.",
    description:
      "A complete PXE boot implementation: a Linux server providing DHCP and TFTP that boots a legacy PC entirely over the network - bootloader, kernel and initramfs downloaded, no local OS required.",
    stack: ["Linux", "PXE", "DHCP", "TFTP", "SYSLINUX", "UDP"],
    github: "https://github.com/dhanushbs10/PXE-Network-Boot-Lab",
    features: [
      "Legacy PC booted diskless - PXE ROM → DHCP → TFTP → Linux from RAM",
      "DHCP options 66 (TFTP server) + 67 (bootfile) configured and verified with tcpdump",
      "TFTP root at /srv/tftp, world-readable, 512-byte block transfers over UDP/69",
      "SYSLINUX/PXELINUX for BIOS clients; GRUB2 path documented for UEFI",
      "Five real failures diagnosed and fixed (DHCP options, TFTP paths, firewall, BIOS order, UEFI)",
    ],
    flow: [
      { step: "01", title: "Power on", detail: "BIOS/UEFI hands control to the NIC's PXE firmware." },
      { step: "02", title: "DHCP discover", detail: "Client broadcasts DHCPDISCOVER requesting config + PXE options." },
      { step: "03", title: "DHCP offer", detail: "Server replies: client IP, mask, gateway, DNS, TFTP address, bootfile pxelinux.0." },
      { step: "04", title: "TFTP fetch", detail: "Bootloader, then vmlinuz kernel, then initramfs - pulled over TFTP." },
      { step: "05", title: "Boot from RAM", detail: "Kernel executes, initramfs mounts - a working Linux with untouched local disks." },
    ],
    tables: [
      {
        title: "The fix that unblocked boot",
        note: "Missing DHCP options 66/67 - added to dhcpd.conf, restarted dhcpd",
        table: {
          head: ["File", "Change"],
          rows: [
            ["dhcpd.conf", 'option tftp-server-name "192.168.1.10"; filename "pxelinux.0";'],
            ["TFTP root", "chmod 644 /srv/tftp/linux/vmlinuz + initrd.img"],
            ["Firewall", "Allow UDP 67, 68, 69 - or verify with tcpdump"],
          ],
        },
      },
      {
        title: "Challenges fixed",
        table: {
          head: ["Symptom", "Root cause → fix"],
          rows: [
            ["Hang after DHCP", "Missing options 66/67 → added to subnet block"],
            ["Kernel: file not found", "Typo + restrictive perms → fixed names, chmod 644"],
            ["No boot file received", "Firewall / wrong filename → opened UDP, verified pxelinux.0"],
            ["Boots from hard drive", "Boot order → NIC first, fast boot off"],
            ["UEFI refuses pxelinux.0", "BIOS-only loader → grubx64.efi path"],
          ],
        },
      },
    ],
    code: [
      {
        title: "dhcpd.conf (subnet block)",
        lang: "conf",
        body: 'option tftp-server-name "192.168.1.10";\nfilename "pxelinux.0";',
      },
      {
        title: "Watch PXE traffic",
        lang: "bash",
        body: "tcpdump -i eth0 port 69 or port 67 or port 68\nchmod 644 /srv/tftp/linux/vmlinuz /srv/tftp/linux/initrd.img",
      },
    ],
    build: [
      "Linux server + legacy PXE client on one switch (or direct cable)",
      "Install dhcpd + tftpd-hpa; static IP on server; TFTP root /srv/tftp",
      "DHCP scope with options 66/67 → filename pxelinux.0",
      "Stage bootloader + kernel + initramfs; chmod 644",
      "BIOS: NIC first in boot order → network boot",
    ],
  },
  {
    slug: "esp8266-wake-on-lan",
    index: "06",
    title: "ESP8266 Wake-on-LAN",
    category: "Networking",
    tagline: "Wireless PC power button - NodeMCU + touch sensor + LCD.",
    description:
      "A wireless remote PC power-on button using a NodeMCU ESP8266, Wake-on-LAN, and a 16x2 I2C LCD display. Press a capacitive touch sensor to wake a desktop computer over the network - about $8–12 in parts.",
    stack: ["ESP8266", "Arduino", "C++", "WakeOnLan lib", "I2C LCD", "TTP223 Touch"],
    github: "https://github.com/dhanushbs10/ESP8266-Wake-on-LAN",
    features: [
      "Capacitive touch (TTP223 on D6/GPIO12) - tap to send the magic packet",
      "16x2 I2C LCD (0x27) status flow: WiFi Connected → Ready to Touch → WAKING PC... → Packet Sent!",
      "Auto WiFi reconnect, millis()-based non-blocking loop, 200 ms debounce",
      "Local-network only - no cloud dependency; MIT licensed",
    ],
    flow: [
      { step: "01", title: "Touch", detail: "TTP223 sensor on D6 fires; debounce filters false triggers." },
      { step: "02", title: "Display", detail: 'LCD line 2 flips from "Ready to Touch" to "WAKING PC...".' },
      { step: "03", title: "Transmit", detail: "WakeOnLan lib broadcasts the 102-byte magic packet for the Config.h MAC." },
      { step: "04", title: "Boot", detail: 'Target NIC (WoL enabled in BIOS + OS) powers the PC on; LCD shows "Packet Sent!".' },
    ],
    tables: [
      {
        title: "Bill of materials (~$8–12)",
        table: {
          head: ["Part", "Notes"],
          rows: [
            ["NodeMCU ESP8266 (ESP-12E)", "Main board"],
            ["16x2 I2C LCD (PCF8574)", "Address 0x27 - needs 5V from VIN"],
            ["TTP223 touch sensor", "Digital out to D6 - 3.3V supply"],
            ["Jumper wires + Micro-USB", "Programming and power"],
          ],
        },
      },
      {
        title: "Wiring",
        table: {
          head: ["Connection", "Pin"],
          rows: [
            ["LCD SCL / SDA", "D1 (GPIO5) / D2 (GPIO4)"],
            ["LCD VCC / GND", "VIN 5V / GND - never 3.3V"],
            ["Touch OUT / VCC / GND", "D6 (GPIO12) / 3V3 / GND"],
          ],
        },
      },
      {
        title: "Config.h essentials",
        table: {
          head: ["Setting", "Value"],
          rows: [
            ["TARGET_MAC", "{0x94, 0xDE, 0x80, 0x7B, 0x2F, 0x99}"],
            ["TOUCH_PIN", "12 (D6)"],
            ["LCD_I2C_ADDRESS", "0x27 (try 0x3F if blank)"],
          ],
        },
      },
    ],
    code: [
      {
        title: "Config.h",
        lang: "cpp",
        body: 'const char* WIFI_SSID = "YourWiFiSSID";\nconst char* WIFI_PASSWORD = "YourWiFiPassword";\nconst byte TARGET_MAC[6] = {0x94, 0xDE, 0x80, 0x7B, 0x2F, 0x99};\nconst int TOUCH_PIN = 12;',
      },
      {
        title: "Find the PC MAC (Windows)",
        lang: "cmd",
        body: 'ipconfig /all | findstr "Physical"',
      },
    ],
    build: [
      "Arduino IDE + ESP8266 board support; libs: LiquidCrystal I2C, WakeOnLan",
      "Board: NodeMCU 1.0 (ESP-12E); edit Config.h (WiFi, MAC, pins)",
      "PC side: enable WoL in BIOS + adapter (magic packet, allow wake)",
      "Upload sketch → Serial Monitor @115200 → touch to wake",
    ],
  },
  {
    slug: "cross-subnet-smb-fix",
    index: "07",
    title: "Cross-Subnet SMB Fix",
    category: "Networking",
    tagline: "Extender NAT silently split the LAN - diagnosed to Layer 3.",
    description:
      "Root-cause diagnosis of a Wi-Fi extender's NAT mode silently splitting a home network into two subnets, breaking Windows file sharing. Fixed by converting the extender to access-point mode - no Windows changes needed.",
    stack: ["TCP/IP", "Subnetting", "SMB", "DHCP", "NAT", "Wireshark-style analysis"],
    github: "https://github.com/dhanushbs10/Cross-Subnet-SMB-Sharing-Fix",
    features: [
      "8-step elimination: services → permissions → firewall → ipconfig → ping → DHCP trace → extender UI",
      "Caught by evidence: laptop gateway 192.168.2.1 vs desktop 192.168.1.1 - a second DHCP server",
      "Root cause: extender in Router/NAT mode with DHCP pool 192.168.2.100–199",
      "Fix: AP/bridge mode, extender DHCP off → single 192.168.1.0/24, sharing restored instantly",
    ],
    flow: [
      { step: "01", title: "Symptoms", detail: "Shares refused to open; Network Neighborhood empty; \\\\IP\\share failed; ping-by-name failed but ping-by-IP worked." },
      { step: "02", title: "Rule out Windows", detail: "Discovery services running, Everyone permissions set, firewall disabled temporarily - no change." },
      { step: "03", title: "ipconfig reveals", detail: "Desktop 192.168.1.105/24 via 192.168.1.1; laptop 192.168.2.58/24 via 192.168.2.1. Two subnets, two DHCP servers." },
      { step: "04", title: "Trace the rogue DHCP", detail: "192.168.2.1 was the extender - running Router/NAT mode, its own pool and gateway." },
      { step: "05", title: "Fix + verify", detail: "AP mode, DHCP off, reboot, renew - both on 192.168.1.x, same gateway, SMB works." },
    ],
    tables: [
      {
        title: "Smoking gun - ipconfig /all",
        table: {
          head: ["Interface", "Address"],
          rows: [
            ["Desktop (wired)", "192.168.1.105 · mask /24 · gw 192.168.1.1 · DHCP 192.168.1.1"],
            ["Laptop (Wi-Fi)", "192.168.2.58 · mask /24 · gw 192.168.2.1 · DHCP 192.168.2.1"],
          ],
        },
      },
      {
        title: "Before vs after",
        table: {
          head: ["Aspect", "Before → After"],
          rows: [
            ["Topology", "Extender NAT, two subnets → AP bridge, one flat network"],
            ["Addresses", "Desktop .1.x + laptop .2.x → both 192.168.1.x"],
            ["DHCP", "Router + extender → router only"],
            ["Broadcast domain", "Two → one (NetBIOS/LLMNR discovery restored)"],
            ["File sharing", "Inaccessible → fully functional"],
          ],
        },
      },
    ],
    code: [
      {
        title: "Diagnosis commands",
        lang: "cmd",
        body: "ipconfig /all\nping 192.168.1.105\n\\\\192.168.1.105\\share",
      },
    ],
    build: [
      "Reproduce: extender in Router/NAT mode → clients land on 192.168.2.x",
      "Gather: ipconfig on both machines, compare gateway + DHCP server",
      "Fix: extender admin → Access Point mode → DHCP off → reboot",
      "Verify: both on 192.168.1.x/24, gateway 192.168.1.1, SMB opens",
    ],
  },
];

export const categories = ["All", "Security", "Networking", "Systems", "Web"] as const;
