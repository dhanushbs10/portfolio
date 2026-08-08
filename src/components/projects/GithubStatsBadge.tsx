import { getRepoStats } from "@/lib/github";
import type { ProjectFrontmatter } from "@/lib/types";

interface GithubStatsBadgeProps {
  repo: string;
}

export async function GithubStatsBadge({ repo }: GithubStatsBadgeProps) {
  const stats = await getRepoStats(repo);

  if (!stats) return null;

  const formatDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const items: { label: string; value: string }[] = [
    { label: "★", value: String(stats.stars) },
    { label: "⑂", value: String(stats.forks) },
    { label: "↻", value: String(stats.openIssues) },
  ];

  if (stats.lastCommit) {
    items.push({ label: "last commit", value: formatDate(stats.lastCommit) });
  }

  if (stats.language) {
    items.push({ label: "lang", value: stats.language });
  }

  return (
    <div className="mt-8 p-4 rounded bg-surface-raised border border-border-subtle">
      <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs">
        {items.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className="text-text-tertiary">{item.label}</span>
            <span className="text-text-primary">{item.value}</span>
          </span>
        ))}
        <span className="text-text-tertiary ml-auto">
          github.com/{repo}
        </span>
      </div>
    </div>
  );
}
