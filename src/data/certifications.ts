import type { Certification } from "@/lib/types";

export const certifications: Certification[] = [
  {
    id: "cert-001",
    name: "[Cert Name — e.g. CompTIA Security+]",
    issuer: "[Issuer — e.g. CompTIA]",
    logo: "",
    status: "planned",
    dateEarned: undefined,
    credentialUrl: undefined,
  },
  {
    id: "cert-002",
    name: "[In-Progress Cert — e.g. CCNA]",
    issuer: "[Issuer — e.g. Cisco]",
    logo: "",
    status: "in-progress",
  },
  {
    id: "cert-003",
    name: "[Another Planned Cert — e.g. eJPT]",
    issuer: "[Issuer — e.g. eLearnSecurity]",
    logo: "",
    status: "planned",
  },
];
