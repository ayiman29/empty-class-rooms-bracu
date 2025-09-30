import { useEffect, useState, useMemo } from 'react';
import { buildScheduleIndex } from '../utils/processSchedule.js';

export function useScheduleData(url = 'https://usis-cdn.eniamza.com/connect.json') {
  const [sections, setSections] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abort = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!abort) setSections(data);
      } catch (e) {
        if (!abort) setError(e.message);
      } finally {
        if (!abort) setLoading(false);
      }
    }
    load();
    return () => { abort = true; };
  }, [url]);

  const index = useMemo(() => {
    if (!sections) return null;
    return buildScheduleIndex(sections);
  }, [sections]);

  return { loading, error, index };
}