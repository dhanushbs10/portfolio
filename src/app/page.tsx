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
import { HomeLabTeaser } from "@/components/sections/HomeLabTeaser";
import { getFeaturedProjects } from "@/lib/mdx";

export default function HomePage() {
  // Server-side data: featured projects fetched once at build/request time
  const featured = getFeaturedProjects();

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
      <ProjectsFeaturedSection projects={featured} />
      <HomeLabTeaser />
      <RoadmapPreview />
      <Achievements />
      <ContactSection />
    </>
  );
}

// Server wrapper — fetches data, passes as props to client component
function ProjectsFeaturedSection({
  projects,
}: {
  projects: ReturnType<typeof getFeaturedProjects>;
}) {
  return <ProjectsPreview projects={projects} />;
}
