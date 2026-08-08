export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  lastCommit: string;
  language: string;
}

export async function getRepoStats(repo: string): Promise<RepoStats | null> {
  const token = process.env.GITHUB_TOKEN;
  // Server-side only — never expose token via NEXT_PUBLIC_ prefix.
  // If no token is configured, skip gracefully so the badge hides itself.
  if (!token) return null;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
    Authorization: `Bearer ${token}`,
  };

  const [repoRes, langsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${repo}`, { headers, next: { revalidate: 21600 } }),
    fetch(`https://api.github.com/repos/${repo}/languages`, { headers, next: { revalidate: 21600 } }),
  ]);

  if (!repoRes.ok) return null;

  const repoData = await repoRes.json();
  const langsData = langsRes.ok ? await langsRes.json() : {};

  const languageEntries = Object.entries(langsData);
  languageEntries.sort((a, b) => (b[1] as number) - (a[1] as number));

  return {
    stars: repoData.stargazers_count ?? 0,
    forks: repoData.forks_count ?? 0,
    openIssues: repoData.open_issues_count ?? 0,
    lastCommit: repoData.pushed_at ?? "",
    language: languageEntries[0]?.[0] ?? "",
  };
}
