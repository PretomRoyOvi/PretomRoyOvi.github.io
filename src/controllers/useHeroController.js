/**
 * Hero Controller - fetches hero slides for carousel
 */
import { useState, useEffect } from 'react';
import { heroModel } from '../models/api.js';

export function useHeroController() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    heroModel
      .getData()
      .then((data) => {
        const list = [...(data?.slides ?? [])];
        list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
        setSlides(list);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { slides, loading, error };
}
