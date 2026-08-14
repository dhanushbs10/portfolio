import { SectionHeading } from "@/components/shared/SectionHeading";

export default function CTFPage() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="CTF"
          title="Capture The Flag"
          subtitle="Competitions and writeups coming soon."
        />
        <p className="mt-8 text-text-secondary">
          CTF entries and writeups will be published here.
        </p>
      </div>
    </section>
  );
}
