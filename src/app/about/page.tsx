import { SectionHeading } from "@/components/shared/SectionHeading";

export default function AboutPage() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl space-y-16">
        {/* Hero */}
        <div className="space-y-4">
          <SectionHeading
            eyebrow="About"
            title={
              <span className="text-text-primary">
                Dhanush <span className="text-accent-interactive">B S</span>
              </span>
            }
            subtitle="Diploma in Computer Science & Engineering — Cybersecurity pathway, Semester 5 · Bengaluru, IN"
          />
          <p className="font-mono text-sm text-text-tertiary">
            Born 7 October 2008 · prefers Dhanush or Dhanu
          </p>
        </div>

        {/* Who I am */}
        <div className="space-y-4">
          <p className="text-lg text-text-secondary leading-relaxed">
            I'm a curious, practical technical learner currently pursuing a Diploma in
            Computer Science and Engineering at Bengaluru, focusing on cybersecurity.
            My strongest interests are hardware, networking, and cybersecurity — but
            I've explored a lot of things: electronics, robotics, Linux, programming,
            AI, gaming infrastructure, you name it.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed">
            I learn by doing — see something, get curious, try it, break it,
            investigate, understand it, move on. Theory-first learning never
            clicked for me. I chose a Diploma over a theory-heavy degree because
            I'd rather build something broken than study a textbook about how it
            could work.
          </p>
          <p className="text-text-tertiary font-mono text-sm">
            &gt; "being good is enough" — that's my standard.
          </p>
        </div>

        {/* Early days */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
            How it started
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Around Pre-KG, there was a computer at home belonging to my father. I
            watched him use it, then tried turning it on myself the next day —
            curious enough to press buttons without knowing what they did. That
            curiosity became a recurring pattern.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Around 4th grade I corrupted the family Windows install while gaming.
            No other computer, no Wi-Fi at the time. Six months later — after
            YouTube tutorials and a cousin's laptop used to build a Windows
            installer — the machine was working again. That's how I learned
            computer repair: not from a class, but because something was broken
            and I wanted to understand how to fix it.
          </p>
          <p className="text-text-secondary leading-relaxed">
            COVID amplified that. Suddenly I had time to explore — gaming,
            tech content, YouTube tutorials, random software. By the end of it
            technology wasn't something I just used anymore. It was something I
            wanted to understand.
          </p>
        </div>

        {/* Education */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
            Education
          </h2>
          <div className="space-y-6">
            <div className="border-l-2 border-accent-interactive pl-4">
              <p className="font-mono text-xs text-text-tertiary mb-1">
                2023 — Present
              </p>
              <h3 className="font-display text-lg font-medium text-text-primary">
                Diploma in Computer Science & Engineering
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Cybersecurity pathway · Currently Semester 5 · Bengaluru, Karnataka
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
                <li>· Information Security & Networking Foundations</li>
                <li>· Application Security & Cryptographic Controls</li>
                <li>· Threat Vectors, Exploits & Infrastructure Audits</li>
                <li>· Advanced Web Hacking, Kali Linux & Incident Response</li>
              </ul>
            </div>

            <div className="border-l-2 border-border-subtle pl-4">
              <p className="font-mono text-xs text-text-tertiary mb-1">
                2016 — 2024
              </p>
              <h3 className="font-display text-lg font-medium text-text-primary">
                SSLC
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Sri Vidya Public School · Bengaluru, Karnataka
              </p>
              <p className="mt-2 text-sm text-text-tertiary">
                Built the foundation — mathematics, science, and the first
                exposure to computers and programming.
              </p>
            </div>
          </div>
        </div>

        {/* Technical interests */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
            What I'm into
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Hardware",
                desc:
                  "CPUs, GPUs, motherboards, BIOS, repair, diagnostics, repurposing old hardware. Currently my strongest interest.",
              },
              {
                title: "Networking",
                desc:
                  "Home networks, subnets, DHCP/DNS, SMB, wake-on-LAN, Cisco. Dream job: Network Engineer.",
              },
              {
                title: "Cybersecurity",
                desc:
                  "Formal academic pathway (Semester 5). Info-sec, network security, cryptography, Kali Linux, incident response.",
              },
              {
                title: "Electronics & Robotics",
                desc:
                  "ESP8266/ESP32, microcontrollers, sensors, circuits. Learned from my brother's EEE stash + YouTube.",
              },
              {
                title: "Linux / OS",
                desc:
                  "Kali, Debian, Linux Lite, dual-boot, GRUB, driver issues, troubleshooting everything.",
              },
              {
                title: "Programming",
                desc:
                  "Python, Java, JavaScript, SQL, small tooling. I learn it by building things with it.",
              },
              {
                title: "AI & LLMs",
                desc:
                  "Local AI, model routing, coding assistants, personal AI systems. Recently became a major interest.",
              },
              {
                title: "Web Development",
                desc:
                  "Next.js, Tailwind, clean UI. I prefer modern, polished, interactive sites over generic templates.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-lg border border-border-subtle bg-surface-raised/50"
              >
                <h3 className="font-mono text-sm text-accent-interactive mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
            Where I'm headed
          </h2>
          <div className="space-y-4 text-text-secondary leading-relaxed">
            <p>
              Near term: land a solid Network Engineering job. Networking is
              the direction I'm most intentional about — CCNA/Cisco is on the
              horizon.
            </p>
            <p>
              Long term: get to a point where I have financial independence and
              the freedom to build what I want. Not chasing fame or status — I
              just want to be good at what I do and have the space to keep
              exploring.
            </p>
            <p>
              Dream project: a dedicated home lab room — servers, a SOC/security
              analysis environment, private cloud, 3–4 interconnected multi-OS
              machines, IoT automation, strong privacy and isolation. I want
              maximum capability from a minimal, well-engineered setup.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="border-t border-border-subtle pt-8 space-y-3">
          <p className="text-text-secondary leading-relaxed">
            I'm not an expert at everything. I'm curious about a lot of things,
            I learn fast, and I build things to understand them. Sometimes I
            finish projects, sometimes I don't — but I always learn something
            from the attempt.
          </p>
          <p className="text-text-tertiary font-mono text-sm">
            &gt; &quot;see something, become curious, try it, break it, investigate it,
            understand it, move to the next interesting thing.&quot;
          </p>
          <p className="text-text-tertiary font-mono text-sm">
            &gt; the real goal: turn breadth into depth.
          </p>
        </div>
      </div>
    </section>
  );
}
