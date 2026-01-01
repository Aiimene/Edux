"use client";

import { useEffect, useState, useCallback } from 'react';
import { getLevels } from '@/lib/api/levels';

export type ModuleItem = { id: string; name: string };
export type LevelItem = { id: string; name: string; modules: ModuleItem[] };

export function useLevels() {
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLevels();
      const list = Array.isArray(res) ? res : (res?.results ?? []);
      const mapped: LevelItem[] = (list || []).map((l: any) => ({
        id: String(l.id),
        name: l.name,
        modules: (l.modules || []).map((m: any) => ({ id: String(m.id), name: m.name })),
      }));
      setLevels(mapped);
    } catch (e: any) {
      console.error('Failed to load levels:', e);
      setError(e?.message || 'Failed to load levels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { levels, loading, error, reload: load };
}

export default useLevels;
