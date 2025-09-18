import { useEffect, useState } from 'react';

type Scheme = 'light' | 'dark';

export function useColorScheme(): Scheme {
  const get = (): Scheme =>
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const [scheme, setScheme] = useState<Scheme>(get());

  useEffect(() => {
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onChange = () => setScheme(mql.matches ? 'dark' : 'light');
    mql?.addEventListener?.('change', onChange);
    return () => mql?.removeEventListener?.('change', onChange);
  }, []);

  return scheme;
}
