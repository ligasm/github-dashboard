import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { AssigneeGroup } from '../types/pr';

interface AssigneeChartProps {
  groups: AssigneeGroup[];
  dark: boolean;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export function AssigneeChart({ groups, dark }: AssigneeChartProps) {
  const data = groups
    .filter(g => g.assignee.login !== 'Unassigned')
    .map(g => ({ name: g.assignee.login, count: g.prs.length }));

  if (data.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-3">PRs per Assignee</h2>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#e5e7eb'} />
          <XAxis type="number" allowDecimals={false} stroke={dark ? '#9ca3af' : '#374151'} />
          <YAxis type="category" dataKey="name" width={80} stroke={dark ? '#9ca3af' : '#374151'} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: dark ? '#fff' : '#000' }}
          />
          <Bar dataKey="count" name="Open PRs" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
