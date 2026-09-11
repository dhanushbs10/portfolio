import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://bsdhanush.qzz.io";
  const lastModified = new Date();
  return [
    { url: base, lastModified },
    { url: `${base}/about`, lastModified },
    { url: `${base}/projects`, lastModified },
    { url: `${base}/homelab`, lastModified },
    { url: `${base}/contact`, lastModified },
  ];
}