import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Project, ProjectFrontmatter } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);

  return {
    ...(data as ProjectFrontmatter),
    slug,
    content,
  };
}

export function getAllProjects(): Project[] {
  // Reference docs (e.g. dhanush-ping-profile.mdx, status:"reference") are
  // internal knowledge for the Ping chatbot — never rendered as a project card.
  return getAllProjectSlugs()
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is Project => p !== null && p.status !== "reference");
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectsByStatus(status: string): Project[] {
  return getAllProjects().filter((p) => p.status === status);
}

export function renderMDX(content: string) {
  return MDXRemote({ source: content });
}
