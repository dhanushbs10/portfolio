import { SectionHeading } from "@/components/shared/SectionHeading";

export default function HomePage() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Portfolio"
          title="Dhanush Nagishetti"
          subtitle="Building at the intersection of infrastructure, systems, and design."
          align="center"
        />
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="/projects"
            className="bg-accent-structure hover:bg-accent-structure-light text-text-primary rounded px-5 py-2.5 font-mono text-sm tracking-wide transition-colors"
          >
            View Projects
          </a>
          <a
            href="/dev/kitchen-sink"
            className="border border-accent-interactive text-accent-interactive hover:bg-accent-interactive hover:text-surface-base rounded px-5 py-2.5 font-mono text-sm tracking-wide transition-colors"
          >
            Design Tokens
          </a>
        </div>
      </div>
    </section>
  );
}
