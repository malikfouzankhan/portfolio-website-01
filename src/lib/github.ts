import { profile } from "@/data/profile";

export type GithubActivity = {
  publicRepos: number | null;
  lastPushed: string | null;
};

/** Relative time, e.g. "4 hours ago". Coarse on purpose. */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

/** Server-only. Cached for an hour and degrades to nulls on any failure —
 *  the hero renders without the live row rather than erroring. */
export async function getGithubActivity(): Promise<GithubActivity> {
  const empty: GithubActivity = { publicRepos: null, lastPushed: null };

  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.githubUsername}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return empty;

    const data = (await res.json()) as {
      public_repos?: number;
      updated_at?: string;
    };

    return {
      publicRepos: data.public_repos ?? null,
      lastPushed: data.updated_at ?? null,
    };
  } catch {
    return empty;
  }
}
