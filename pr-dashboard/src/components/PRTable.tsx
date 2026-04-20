import { useState } from 'react';
import type { AssigneeGroup } from '../types/pr';
import { PRList } from './PRList';

interface PRTableProps {
  groups: AssigneeGroup[];
}

export function PRTable({ groups }: PRTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (login: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(login)) next.delete(login);
      else next.add(login);
      return next;
    });
  };

  if (groups.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 text-center py-8">No open PRs found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            <th className="px-4 py-3 font-semibold">Assignee</th>
            <th className="px-4 py-3 font-semibold"># Open PRs</th>
            <th className="px-4 py-3 font-semibold">PR Numbers</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-gray-700">
          {groups.map(({ assignee, prs }) => (
            <>
              <tr
                key={assignee.login}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => toggle(assignee.login)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {assignee.avatar_url && (
                      <img src={assignee.avatar_url} alt={assignee.login} className="w-7 h-7 rounded-full" />
                    )}
                    <span className="font-medium">{assignee.login}</span>
                    <span className="text-gray-400 text-xs">{expanded.has(assignee.login) ? '▲' : '▼'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold text-sm">
                    {prs.length}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                  {prs.map(pr => (
                    <a
                      key={pr.id}
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-2 text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={e => e.stopPropagation()}
                    >
                      #{pr.number}
                    </a>
                  ))}
                </td>
              </tr>
              {expanded.has(assignee.login) && (
                <tr key={`${assignee.login}-detail`}>
                  <td colSpan={3} className="px-6 pb-4 bg-gray-50 dark:bg-gray-800/50">
                    <PRList prs={prs} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
