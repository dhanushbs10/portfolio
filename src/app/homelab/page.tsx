import { SectionHeading } from "@/components/shared/SectionHeading";
import { getHardware } from "@/lib/data";
import type { HardwareCategory } from "@/lib/types";
import { Cpu, MemoryStick, Monitor, HardDrive, Network, Cable, Fan, PlugZap, CircuitBoard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CATEGORY_META: Record<HardwareCategory, { label: string; icon: LucideIcon }> = {
  cpu: { label: "CPU / Processor", icon: Cpu },
  ram: { label: "Memory", icon: MemoryStick },
  gpu: { label: "GPU", icon: Monitor },
  storage: { label: "Storage", icon: HardDrive },
  chipset: { label: "Chipset", icon: CircuitBoard },
  network: { label: "Networking", icon: Network },
  pcie: { label: "PCIe", icon: Cable },
  cooling: { label: "Cooling", icon: Fan },
  power: { label: "Power", icon: PlugZap },
};

const CATEGORY_ORDER: HardwareCategory[] = [
  "cpu",
  "ram",
  "gpu",
  "storage",
  "network",
  "chipset",
  "pcie",
  "cooling",
  "power",
];

export default function HomelabPage() {
  const hardware = getHardware();

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    meta: CATEGORY_META[category],
    items: hardware.filter((h) => h.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl space-y-16">
        <SectionHeading
          eyebrow="Homelab"
          title={
            <span className="text-text-primary">
              The <span className="text-accent-interactive">Lab</span>
            </span>
          }
          subtitle="The hardware I actually run and break in my home network. Specs straight from the machine, narratives coming as the setup evolves."
        />

        <p className="font-mono text-sm text-text-tertiary">
          Honest note: the big-picture narrative for each component is still being written.
          What&apos;s below is the current spec sheet, no filler.
        </p>

        <div className="space-y-10">
          {grouped.map(({ category, meta, items }) => {
            const Icon = meta.icon;
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-accent-interactive shrink-0" />
                  <h2 className="font-mono text-xs tracking-widest uppercase text-text-primary">
                    {meta.label}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((h) => (
                    <div key={h.id} className="card p-5 flex flex-col gap-2">
                      <h3 className="font-display text-sm font-semibold text-text-primary">
                        {h.name}
                      </h3>
                      {h.specs.length > 0 && (
                        <ul className="flex flex-col gap-1">
                          {h.specs.map((spec, i) => (
                            <li
                              key={i}
                              className="font-mono text-[11px] text-text-tertiary flex gap-2"
                            >
                              <span className="text-accent-interactive">/</span>
                              {spec}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}