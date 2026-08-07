import {
  Hero,
  AboutMe,
  Journey,
  Education,
  SkillsPreview,
  TechStack,
  CertificationsPreview,
  ProjectsPreview,
  RoadmapPreview,
  Achievements,
  ContactSection,
} from "@/components/sections";
import { ScrollBackground } from "@/components/shared/ScrollBackground";

export default function HomePage() {
  return (
    <>
      <ScrollBackground />
      <Hero />
      <AboutMe />
      <Journey />
      <Education />
      <SkillsPreview />
      <TechStack />
      <CertificationsPreview />
      <ProjectsPreview />
      <RoadmapPreview />
      <Achievements />
      <ContactSection />
    </>
  );
}
