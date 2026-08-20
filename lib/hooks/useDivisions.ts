import { useEffect, useState } from 'react';

import { fetchDivisions } from '@/lib/api/jobs';
import type { Division } from '@/types/job';

export function useDivisions() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchDivisions()
      .then((result) => {
        if (!cancelled) setDivisions(result);
      })
      .catch(() => {
        // Divisions are a filter convenience; fail silently and just show
        // an unfiltered job list rather than blocking the whole screen.
        if (!cancelled) setDivisions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { divisions, loading };
}
