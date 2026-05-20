import { NextResponse } from "next/server";

const USERNAME = "Abhijeetsingh2100";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profileResponse = await fetch(`https://api.github.com/users/${USERNAME}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "abhijeet-portfolio",
      },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return NextResponse.json(
        { error: "Unable to load GitHub profile data." },
        { status: profileResponse.status },
      );
    }

    const profile = (await profileResponse.json()) as {
      name: string | null;
      bio: string | null;
      public_repos: number;
      followers: number;
      following: number;
      public_gists: number;
      html_url: string;
      avatar_url: string;
    };

    const reposResponse = await fetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "abhijeet-portfolio",
        },
        cache: "no-store",
      },
    );

    type GitHubRepoApi = {
      fork: boolean;
      name: string;
      description: string | null;
      html_url: string;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      updated_at: string;
    };

    const repos = (reposResponse.ok ? await reposResponse.json() : []) as GitHubRepoApi[];

    const repoList = Array.isArray(repos)
      ? repos
          .filter((repo) => !repo.fork)
          .map((repo) => ({
            name: repo.name,
            description: repo.description,
            htmlUrl: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at,
          }))
          .sort(
            (left, right) =>
              new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
          )
      : [];

    const totalStars = repoList.reduce((sum, repo) => sum + (repo.stars ?? 0), 0);
    const totalForks = repoList.reduce((sum, repo) => sum + (repo.forks ?? 0), 0);

    return NextResponse.json({
      name: profile.name ?? USERNAME,
      bio: profile.bio,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      publicGists: profile.public_gists,
      totalStars,
      totalForks,
      profileUrl: profile.html_url,
      avatarUrl: profile.avatar_url,
      repositories: repoList.slice(0, 6),
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected error while loading GitHub profile." },
      { status: 500 },
    );
  }
}
