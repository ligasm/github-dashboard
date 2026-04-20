import { useState, useCallback } from 'react';
import type { PR } from '../types/pr';
import { fetchOpenPRs } from '../utils/github';

interface UseOpenPRsResult {
  prs: PR[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  fetch: (token: string, repo: string) => Promise<void>;
}

export function useOpenPRs(): UseOpenPRsResult {
  const [prs, setPRs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetch = useCallback(async (token: string, repo: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpenPRs(token, repo);
      setPRs(data);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { prs, loading, error, lastFetched, fetch };
}
