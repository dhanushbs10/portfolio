import { SectionHeading } from "@/components/shared/SectionHeading";

export default function ResearchPage() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Research"
          title="Research Notes"
          subtitle="Technical notes and deep dives coming soon."
        />
        <p className="mt-8 text-text-secondary">
          Research notes and writeups will be published here.
        </p>
      </div>
    </section>
  );
}
