export const cv = {
  header: {
    name: "Dhanush B S",
    title: "Cybersecurity & Networking Student",
    contact:
      "Bengaluru, Karnataka, India | +91 81232 52577 | dhanushpoojari101@gmail.com | github.com/dhanushbs10 | linkedin.com/in/dhanush-b-s-4b454a368 | bsdhanush.qzz.io",
  },
  summary:
    "Computer Science diploma student with hands-on project experience across full-stack development, desktop applications, systems programming, offensive security research, and networking labs. Self-driven builder comfortable on Linux, with microcontrollers (Jetson Nano, Raspberry Pi, ESP8266) and home-lab networking, working toward a goal of becoming a Cisco Certified Network Engineer. Currently in Semester 5 and seeking an internship to apply and grow practical skills in software engineering, networking, and cybersecurity.",
  education: [
    {
      degree: "Diploma in Computer Science and Engineering",
      school: "Ramaiah Polytechnic, Bengaluru",
      period: "In progress - Semester 5 (2023 - 2026)",
      grade: "",
    },
    {
      degree: "SSLC (Secondary School)",
      school: "Sri Vidya Public School",
      period: "2024",
      grade: "68%",
    },
  ],
  skills: [
    { group: "Languages", items: ["Python (Intermediate)", "TypeScript/JavaScript", "Rust", "C", "Bash"] },
    { group: "Frameworks & Runtime", items: ["React", "Next.js", "Tauri", "Node.js (Intermediate)"] },
    { group: "Databases", items: ["SQL (Intermediate)", "SQLite", "Supabase / PostgreSQL"] },
    { group: "Operating Systems", items: ["Linux (Advanced)", "Windows (Advanced)", "Kali Linux"] },
    { group: "Security Tools", items: ["Nmap", "Wireshark", "Burp Suite", "Metasploit", "Wifite", "Hashcat", "John the Ripper", "PowerShell scripting"] },
    { group: "Networking", items: ["TCP/IP", "Subnetting", "DHCP", "DNS", "SMB", "Wake-on-LAN", "Cisco Packet Tracer (network design)"] },
    { group: "Tools", items: ["Git", "GitHub"] },
    { group: "Hardware & Embedded", items: ["Jetson Nano", "Raspberry Pi", "ESP8266", "microcontrollers", "IoT & home automation", "drone systems (incl. FPV)"] },
  ],
  projects: [
    {
      name: "ShellPlay - Interactive Linux Terminal Simulator",
      meta: "Live: v0-shellplay.vercel.app",
      points: [
        "Built a browser-based Linux terminal simulator supporting 100+ commands, a full shell script interpreter (variables, loops, conditionals, pipelining, redirection), and an in-memory virtual filesystem.",
        "Implemented an in-memory virtual filesystem with Unix-style permissions and ownership simulation; every command runs entirely in memory.",
        "Engineered the command parsing/execution engine with bash-style scripting semantics for a realistic terminal that runs anywhere without a backend.",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      name: "ZeroHop - Secure Peer-to-Peer File & Text Transfer",
      meta: "GitHub: github.com/dhanushbs10/droplink",
      points: [
        "Built a secure peer-to-peer file and text transfer app over WebRTC DataChannels with AES-256-GCM end-to-end encryption, so no file data ever touches a server.",
        "Implemented Socket.io signaling for the SDP/ICE handshake with Supabase (PostgreSQL/Auth) for accounts and buddy history plus a guest mode, folder uploads, and auto-resume.",
        "Added chunked file handling with per-file progress, QR join and clipboard sync, hardening signaling with a 30/IP/min rate limit and ICE-restart recovery.",
      ],
      stack: ["Next.js", "React", "TypeScript", "WebRTC", "Socket.io", "Supabase"],
    },
    {
      name: "PhantomSection - EDR-Evasive Shellcode Loader (C++)",
      meta: "GitHub: github.com/dhanushbs10/PhantomSection - Defensive research",
      points: [
        "Built a C++ shellcode loader that evades userland hooks via PEB walking for module discovery and EAT parsing for manual resolution of VirtualAlloc and VirtualProtect.",
        "Implemented ETW blinding by patching EtwEventWrite in ntdll.dll (xor rax, rax; ret) with runtime XOR (0x55) decryption staged from payload.bin.",
        "Validated the loader against Windows Defender and ETW telemetry, confirming that XOR staging and a minimal IAT reduce both static and dynamic detection, for defensive research only.",
      ],
      stack: ["C++", "Win32", "Visual Studio"],
    },
    {
      name: "Vynlore - Lossless-First Desktop Music Player",
      meta: "GitHub: github.com/dhanushbs10/vynlore",
      points: [
        "Developing a cross-platform desktop music player with Tauri, Rust, and React that plays lossless FLAC audio directly from local folders, with no server or cloud dependency.",
        "Architected the Rust audio pipeline using Symphonia (decoding), Rubato (sample-rate resampling), and cpal (audio output), backed by a SQLite library and playlist system.",
        "Planning a 10-band parametric EQ with genre presets and WASAPI exclusive output for bit-perfect playback.",
      ],
      stack: ["Rust", "Tauri v2", "React", "TypeScript", "SQLite"],
    },
    {
      name: "Ping - Personal RAG Portfolio Chatbot",
      meta: "Personal project",
      points: [
        "Built a retrieval-augmented chatbot using the NVIDIA NIM API (Nemotron 3 model) to answer questions about the owner's background and projects on their behalf.",
        "Structured a detailed personal profile document into a chunked, AI-ingestible knowledge base to power accurate retrieval-based responses.",
      ],
      stack: ["NVIDIA NIM API", "RAG", "JavaScript"],
    },
    {
      name: "Autonomous Person-Tracking Drone - Software & Networking",
      meta: "2026",
      points: [
        "Developed the onboard software for a Jetson Nano-powered autonomous drone that uses real-time camera-based detection to identify people, lock onto a target, and hover/track them without a physical RC controller.",
        "Set up a wireless network (home router + Jetson Nano) enabling SSH access from a laptop for remote monitoring and control, and configured the tracking code to auto-launch on device startup.",
      ],
      stack: ["Jetson Nano", "Computer Vision", "Python", "Linux Networking"],
    },
    {
      name: "PXE Network Boot Lab",
      meta: "GitHub: github.com/dhanushbs10/PXE-Network-Boot-Lab",
      points: [
        "Set up a diskless Linux network-boot lab: DHCP options 66/67, TFTP serving pxelinux.0, and successfully booted a legacy Intel PC entirely over the network.",
        "Diagnosed and fixed five real-world failures during setup: DHCP option misconfiguration, TFTP file paths, firewall rules, boot order, and UEFI vs legacy BIOS.",
      ],
      stack: ["Linux", "DHCP", "TFTP", "SYSLINUX", "UDP"],
    },
    {
      name: "ESP8266 Wake-on-LAN - Wireless PC Power Button",
      meta: "GitHub: github.com/dhanushbs10/ESP8266-Wake-on-LAN",
      points: [
        "Built a wireless power button for a PC: NodeMCU ESP8266 with a TTP223 capacitive touch sensor and a 16x2 I2C LCD, broadcasting a 102-byte magic packet over the LAN.",
        "Used a non-blocking millis() loop for responsive UI updates, added automatic WiFi reconnection, and kept the bill of materials compact.",
      ],
      stack: ["C++", "Arduino", "ESP8266", "Wake-on-LAN"],
    },
    {
      name: "Cross-Subnet SMB Sharing Fix",
      meta: "GitHub: github.com/dhanushbs10/Cross-Subnet-SMB-Sharing-Fix",
      points: [
        "Root-caused a home network issue where a Wi-Fi extender in NAT mode silently split the LAN into two subnets, breaking SMB file sharing between devices.",
        "Fixed it by switching the extender to AP/bridge mode to restore a single subnet, with no changes to Windows configuration.",
      ],
      stack: ["TCP/IP", "Subnetting", "SMB", "DHCP", "NAT"],
    },
  ],
  certifications: [
    "Cyber Security Audits - Infosys Springboard (July 2025)",
    "Python Concurrent Programming: Multiprocessing in Python - Infosys Springboard (July 2025)",
    "CCNA 200-301 - Cisco (In Progress)",
  ],
  footer: "References available on request. Full project case files at github.com/dhanushbs10",
};