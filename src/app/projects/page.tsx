import { getAllProjects } from "@/lib/mdx";
import type { Project } from "@/lib/types";
import { ProjectsClientGrid } from "@/components/projects/ProjectsClientGrid";

export const metadata = {
  title: "Projects | Dhanush B S",
  description: "All projects — completed, in-progress, and archived.",
};

export default function ProjectsPage() {
  const projects = getAllProjects() as Project[];
  const statuses = ["all", "in-progress", "completed", "archived"] as const;
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <ProjectsClientGrid projects={projects} allStatuses={statuses} />
      </div>
    </section>
  );
}
