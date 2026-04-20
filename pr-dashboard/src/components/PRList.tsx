import type { PR } from '../types/pr';
import { StatusBadge, DraftBadge } from './StatusBadge';

interface PRListProps {
  prs: PR[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function PRList({ prs }: PRListProps) {
  return (
    <ul className="divide-y dark:divide-gray-700">
      {prs.map(pr => (
        <li key={pr.id} className="py-3 flex flex-col gap-1">
          <div className="flex items-start gap-2 flex-wrap">
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              #{pr.number} {pr.title}
            </a>
            {pr.draft && <DraftBadge />}
          </div>
          <div className="flex gap-1 flex-wrap">
            {pr.labels.map(l => (
              <StatusBadge key={l.id} label={l.name} color={l.color} />
            ))}
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Opened {formatDate(pr.created_at)}
          </span>
        </li>
      ))}
    </ul>
  );
}
