import { useEffect, useState } from 'react';
import { TokenInput } from './components/TokenInput';
import { PRTable } from './components/PRTable';
import { AssigneeChart } from './components/AssigneeChart';
import { useOpenPRs } from './hooks/useOpenPRs';
import { groupByAssignee } from './utils/groupByAssignee';

const DEFAULT_REPO = 'ligasm/github-dashboard';
const TOKEN_KEY = 'gh_pat_token';
const REPO_KEY = 'gh_repo';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [repo, setRepo] = useState(() => localStorage.getItem(REPO_KEY) ?? DEFAULT_REPO);
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  const { prs, loading, error, lastFetched, fetch } = useOpenPRs();

  useEffect(() => {
    localStorage.setItem(TOKEN_KEY, token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem(REPO_KEY, repo);
  }, [repo]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleFetch = () => {
    if (token && repo) fetch(token, repo);
  };

  const groups = groupByAssignee(prs);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">PR Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Open pull requests grouped by assignee</p>
          </div>
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg"
            title="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Config */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 mb-6 flex flex-col gap-4">
          <TokenInput token={token} onTokenChange={setToken} />
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm" htmlFor="repo-input">Repository</label>
            <input
              id="repo-input"
              type="text"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              placeholder="owner/repo"
              className="border rounded px-3 py-2 text-sm font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleFetch}
              disabled={loading || !token || !repo}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              {loading ? 'Loading…' : 'Fetch PRs'}
            </button>
            {lastFetched && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last fetched: {lastFetched.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {prs.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {prs.length} open PR{prs.length !== 1 ? 's' : ''} across {groups.length} assignee{groups.length !== 1 ? 's' : ''}
            </div>
            <PRTable groups={groups} />
            <AssigneeChart groups={groups} dark={dark} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
