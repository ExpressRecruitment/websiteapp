import { useCallback, useEffect, useState } from 'react';

import { ApiError, fetchJobs } from '@/lib/api/jobs';
import type { Job } from '@/types/job';

interface UseJobsParams {
  search: string;
  divisionId: number | null;
}

/** Debounce helper so we don't fire a request on every keystroke. */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function useJobs({ search, divisionId }: UseJobsParams) {
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchJobs({ search: debouncedSearch || undefined, divisionId: divisionId ?? undefined })
      .then(({ jobs: result }) => {
        if (!cancelled) setJobs(result);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load vacancies.');
        setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, divisionId, reloadToken]);

  return { jobs, loading, error, reload };
}
