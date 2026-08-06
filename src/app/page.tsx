import {
  Hero,
  AboutMe,
  Journey,
  Education,
  SkillsPreview,
  TechStack,
  CertificationsPreview,
  ProjectsPreview,
  HomeLabTeaser,
  RoadmapPreview,
  Achievements,
  ContactSection,
} from "@/components/sections";
import { ScrollBackground } from "@/components/shared/ScrollBackground";

export default function HomePage() {
  return (
    <>
      {/* Shared persistent background — shifts color as user scrolls */}
      <ScrollBackground />

      {/*
        Each section is imported here in reading order.
        The page file itself stays thin — it's a table of contents,
        not a logic file. Sections manage their own scroll-reveal
        via the <AnimatedReveal> wrapper they each use internally.
      */}
      <Hero />
      <AboutMe />
      <Journey />
      <Education />
      <SkillsPreview />
      <TechStack />
      <CertificationsPreview />
      <ProjectsPreview />
      <HomeLabTeaser />
      <RoadmapPreview />
      <Achievements />
      <ContactSection />
    </>
  );
}
