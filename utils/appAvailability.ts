/**
 * Reachability probe for the local app under test.
 *
 * `login-tests` needs a running app on BASE_URL. Rather than failing the whole
 * suite with ERR_CONNECTION_REFUSED when it isn't up, the specs ask here first
 * and skip themselves — a skipped suite reports honestly, a failed one lies.
 *
 * The result is memoised per process so a describe block with N tests still
 * costs one probe.
 */

const TIMEOUT_MS = 2_000

const cache = new Map<string, Promise<boolean>>()

export function appBaseURL(): string {
  return process.env.BASE_URL ?? 'http://localhost:8100'
}

export function isAppReachable(baseURL: string = appBaseURL()): Promise<boolean> {
  const cached = cache.get(baseURL)
  if (cached) return cached

  const probe = fetch(baseURL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    .then(() => true)
    // Any HTTP response means something is listening; only a transport-level
    // failure (refused / DNS / timeout) counts as "not running".
    .catch(() => false)

  cache.set(baseURL, probe)
  return probe
}
