import { profile } from "@/data/profile";

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

/* Windows shorter than this are invisible anyway — relativeTime's smallest
   bucket above "just now" is a minute, and the one the hero usually sits in
   is hours. 15 minutes is short enough that a push made before a visit reads
   as recent, and 96 calls a day is nothing against either rate limit
   (60/hour unauthenticated, 5000/hour with a token). */
const REVALIDATE_S = 900;

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type Contributions = {
  total: number;
  /** Columns, oldest first. Each is a calendar week; the first and last are
   *  partial, which is why they are kept as ragged arrays rather than padded
   *  to seven — the renderer places each day by its real weekday. */
  weeks: ContributionDay[][];
};

export type GithubData = {
  lastPushed: string | null;
  contributions: Contributions | null;
};

/* GitHub's own bucketing. Deliberately not recomputed from counts: matching
   the quartiles the profile page shows means the hero and github.com never
   disagree about how busy a day looked. */
const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
} as const;

/* `viewer`, not `user(login:)`. The contributions calendar only counts work in
   private repositories for the authenticated user themself — asked about by
   login, the same query comes back with the private days missing.

   Both facts come from one round trip because both need the same token. */
const QUERY = `{
  viewer {
    repositories(first: 1, orderBy: { field: PUSHED_AT, direction: DESC }, affiliations: [OWNER]) {
      nodes { pushedAt }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

type GraphqlPayload = {
  data?: {
    viewer?: {
      repositories?: { nodes?: { pushedAt?: string }[] };
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number;
          weeks?: { contributionDays?: { date?: string; contributionCount?: number; contributionLevel?: keyof typeof LEVELS }[] }[];
        };
      };
    };
  };
  /* GraphQL answers 200 with an `errors` array for things REST would 4xx on,
     so a bare `res.ok` check is not enough to know the query worked. */
  errors?: unknown[];
};

async function graphql(token: string): Promise<GithubData | null> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
    next: { revalidate: REVALIDATE_S },
  });
  if (!res.ok) return null;

  const payload = (await res.json()) as GraphqlPayload;
  if (payload.errors?.length) return null;

  const viewer = payload.data?.viewer;
  if (!viewer) return null;

  const calendar = viewer.contributionsCollection?.contributionCalendar;
  const rawWeeks = calendar?.weeks ?? [];

  const weeks = rawWeeks
    .map((w) =>
      (w.contributionDays ?? []).flatMap<ContributionDay>((d) =>
        d.date
          ? [{ date: d.date, count: d.contributionCount ?? 0, level: LEVELS[d.contributionLevel ?? "NONE"] ?? 0 }]
          : [],
      ),
    )
    .filter((w) => w.length > 0);

  return {
    // Only the timestamp. The repo node carries the name of whatever private
    // work you pushed last; it is dropped here so it cannot reach the HTML.
    lastPushed: viewer.repositories?.nodes?.[0]?.pushedAt ?? null,
    contributions: weeks.length ? { total: calendar?.totalContributions ?? 0, weeks } : null,
  };
}

/** Public, unauthenticated fallback for the push timestamp alone — there is no
 *  equivalent for the calendar, which is GraphQL-only and therefore
 *  token-only. */
const PUBLIC_URL = `https://api.github.com/users/${profile.githubUsername}/repos?sort=pushed&direction=desc&per_page=1`;

async function publicPushedAt(): Promise<string | null> {
  const res = await fetch(PUBLIC_URL, {
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    next: { revalidate: REVALIDATE_S },
  });
  if (!res.ok) return null;

  const repos = (await res.json()) as { pushed_at?: string }[];
  return repos[0]?.pushed_at ?? null;
}

/** Server-only. Both live numbers in the hero, in one request when possible.
 *
 *  `pushedAt` comes off the repo rather than `updated_at` off the user profile:
 *  the latter is the mtime of the profile RECORD, so it moves when you edit
 *  your bio or avatar and sits still when you actually push. It was three days
 *  adrift the day it was replaced.
 *
 *  Degrading in two tiers, because the two values are not equally recoverable:
 *  - With `GITHUB_PAT`, one GraphQL call answers both and private work counts
 *    towards each.
 *  - Without it — local checkout, a preview deploy that never got the secret,
 *    an expired token — the push timestamp falls back to the public repo list
 *    (public repos only) and the calendar is simply absent, because GitHub
 *    exposes it nowhere but GraphQL. The hero drops whichever is null rather
 *    than rendering an empty frame. */
export async function getGithubData(): Promise<GithubData> {
  const token = process.env.GITHUB_PAT;

  try {
    if (token) {
      const data = await graphql(token);
      if (data?.lastPushed || data?.contributions) return data;
    }
    return { lastPushed: await publicPushedAt(), contributions: null };
  } catch {
    return { lastPushed: null, contributions: null };
  }
}
