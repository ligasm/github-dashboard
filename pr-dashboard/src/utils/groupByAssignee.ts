import type { PR, AssigneeGroup, PRUser } from '../types/pr';

export function groupByAssignee(prs: PR[]): AssigneeGroup[] {
  const map = new Map<string, { assignee: PRUser; prs: PR[] }>();

  for (const pr of prs) {
    const assignees = pr.assignees.filter(a => a.type === 'User');
    // If no assignees, group under 'Unassigned'
    if (assignees.length === 0) {
      const key = '__unassigned__';
      if (!map.has(key)) {
        map.set(key, {
          assignee: { login: 'Unassigned', avatar_url: '', type: 'User' },
          prs: [],
        });
      }
      map.get(key)!.prs.push(pr);
    } else {
      for (const assignee of assignees) {
        if (!map.has(assignee.login)) {
          map.set(assignee.login, { assignee, prs: [] });
        }
        map.get(assignee.login)!.prs.push(pr);
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => b.prs.length - a.prs.length);
}
