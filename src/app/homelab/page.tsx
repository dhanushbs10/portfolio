import { SectionHeading } from "@/components/shared/SectionHeading";

export default function HomelabPage() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Homelab" title="Under Construction" />
        <p className="mt-6 text-text-secondary">
          This page will document the homelab setup and infrastructure. Coming in
          a future chapter.
        </p>
      </div>
    </section>
  );
}
