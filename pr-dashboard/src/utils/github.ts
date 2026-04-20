import type { PR } from '../types/pr';

export async function fetchOpenPRs(token: string, repo: string): Promise<PR[]> {
  const allPRs: PR[] = [];
  let url: string | null = `https://api.github.com/repos/${repo}/pulls?state=open&per_page=100`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error('Invalid token or unauthorized');
      if (res.status === 403) throw new Error('API rate limit exceeded or forbidden');
      if (res.status === 404) throw new Error('Repository not found');
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const data: PR[] = await res.json();
    allPRs.push(...data);

    // Parse Link header for pagination
    const linkHeader = res.headers.get('Link');
    const nextMatch = linkHeader?.match(/<([^>]+)>;\s*rel="next"/);
    url = nextMatch ? nextMatch[1] : null;
  }

  return allPRs;
}
