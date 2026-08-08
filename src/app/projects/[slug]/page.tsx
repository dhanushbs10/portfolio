import { getAllProjectSlugs, getProjectBySlug } from "@/lib/mdx";
import { GithubStatsBadge } from "@/components/projects/GithubStatsBadge";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Projects`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  // Prev/next: extract slugs, find current index
  const slugs = getAllProjectSlugs();
  const idx = slugs.indexOf(slug);
  const prevSlug = idx > 0 ? slugs[idx - 1] : null;
  const nextSlug = idx < slugs.length - 1 ? slugs[idx + 1] : null;
  const prev = prevSlug ? getProjectBySlug(prevSlug) : null;
  const next = nextSlug ? getProjectBySlug(nextSlug) : null;

  return (
    <article className="section-container">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-text-primary tracking-tight">
            {project.title}
          </h1>
          <p className="mt-3 text-lg text-text-secondary leading-relaxed">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech: string) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
              >
                {tech}
              </span>
            ))}
          </div>
        </header>

        {project.githubRepo && <GithubStatsBadge repo={project.githubRepo} />}

        {/* Render MDX body — MDXRemote is an RSC-compatible component */}
        <div className="prose mt-10 max-w-none
          [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4
          [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3
          [&_p]:text-text-secondary [&_p]:leading-relaxed
          [&_ul]:text-text-secondary [&_li]:leading-relaxed
          [&_pre]:bg-surface-raised [&_pre]:border [&_pre]:border-border-subtle [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto
          [&_code]:font-mono [&_code]:text-sm
          [&_.token]:text-text-primary
        ">
          <MDXRemote source={project.content} />
        </div>

        <nav className="mt-16 pt-8 border-t border-border-subtle flex justify-between">
          {prev ? (
            <a href={`/projects/${prev.slug}`} className="group flex flex-col gap-1">
              <span className="font-mono text-xs text-text-tertiary">← Previous</span>
              <span className="font-display font-medium text-accent-interactive group-hover:text-accent-interactive-hover transition-colors">
                {prev.title}
              </span>
            </a>
          ) : <span />}
          {next ? (
            <a href={`/projects/${next.slug}`} className="group flex flex-col gap-1 text-right">
              <span className="font-mono text-xs text-text-tertiary">Next →</span>
              <span className="font-display font-medium text-accent-interactive group-hover:text-accent-interactive-hover transition-colors">
                {next.title}
              </span>
            </a>
          ) : <span />}
        </nav>
      </div>
    </article>
  );
}
