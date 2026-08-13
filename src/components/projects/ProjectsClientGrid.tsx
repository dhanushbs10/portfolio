"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";

type StatusFilter = "all" | "in-progress" | "completed" | "archived";

export function ProjectsClientGrid({
  projects,
  allStatuses,
}: {
  projects: Project[];
  allStatuses: readonly StatusFilter[];
}) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<"title" | "status">("title");

  const displayed = useMemo(() => {
    let list = projects;
    if (filter !== "all") list = projects.filter((p) => p.status === filter);
    return [...list].sort((a, b) => {
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return a.title.localeCompare(b.title);
    });
  }, [projects, filter, sortBy]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [projects]);

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`
                px-3 py-1 rounded font-mono text-xs tracking-wide transition-colors border
                ${
                  filter === s
                    ? "bg-accent-interactive text-bg-primary border-accent-interactive"
                    : "bg-surface-overlay text-text-secondary border-border-subtle hover:border-accent-interactive"
                }
              `}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
              <span className="ml-1 opacity-60">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "title" | "status")}
          className="ml-auto bg-surface-overlay border border-border-subtle rounded px-2 py-1.5 font-mono text-xs text-text-secondary"
        >
          <option value="title">Sort: A, Z</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {displayed.map((proj, i) => (
          <motion.article
            key={proj.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="card p-6 flex flex-col gap-4 h-full hover:border-accent-interactive transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {proj.title}
              </h3>
              <span className="status-badge shrink-0">{proj.status}</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed flex-1">
              {proj.summary}
            </p>
            <div className="flex flex-wrap gap-2">
              {proj.techStack.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                >
                  {tag}
                </span>
              ))}
              {proj.techStack.length > 4 && (
                <span className="px-2 py-0.5 font-mono text-[11px] text-text-tertiary">
                  +{proj.techStack.length - 4}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1">
              <a
                href={`/projects/${proj.slug}`}
                className="inline-flex items-center gap-2 font-mono text-xs text-accent-interactive hover:text-accent-interactive-hover transition-colors"
              >
                Read more →
              </a>
              {proj.githubRepo && (
                <a
                  href={`https://github.com/${proj.githubRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs text-accent-interactive hover:text-accent-interactive-hover transition-colors"
                >
                  <span aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.99-1.425-.135-.345-.72-1.425-1.23-1.71-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </span>
                  GitHub
                </a>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </>
  );
}
