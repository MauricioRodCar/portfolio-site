import type { CaseStudy } from "./types";

export const trafficOptimization: CaseStudy = {
  slug: "traffic-optimization",
  lang: "typescript",
  filename: "useCachedFetch.ts",
  tags: ["TypeScript", "React", "Caching", "Performance"],
  code: `
type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
  inFlight: Promise<T> | null;
};

const cache = new Map<string, CacheEntry<unknown>>();

// Serve cached data instantly; only go back to the network once it's this old.
const STALE_AFTER_MS = 30_000;

export function useCachedFetch<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(
    () => (cache.get(key)?.data as T | undefined) ?? null
  );

  useEffect(() => {
    const entry = cache.get(key) as CacheEntry<T> | undefined;
    const isStale = !entry || Date.now() - entry.fetchedAt > STALE_AFTER_MS;

    // Fresh cache hit: the UI already has the data, nothing to do.
    if (!isStale) return;

    // Dedupe: if a request for this key is already in flight — say, from
    // another component mounted a millisecond earlier during the same
    // spike — piggyback on it instead of firing a second identical call.
    const request =
      entry?.inFlight ??
      fetcher().then((result) => {
        cache.set(key, { data: result, fetchedAt: Date.now(), inFlight: null });
        return result;
      });

    cache.set(key, {
      data: entry?.data as T,
      fetchedAt: entry?.fetchedAt ?? 0,
      inFlight: request,
    });

    // Trade-off: on failure we keep serving the last good (stale) value
    // instead of surfacing an error — resilience over freshness.
    request.then(setData).catch(() => {});
  }, [key, fetcher]);

  return data;
}
`.trim(),
};
