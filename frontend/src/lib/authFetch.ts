/**
 * Module-level token getter registered once from the Clerk useAuth() hook
 * (see App.tsx). Repositories are plain TS modules that can't use hooks,
 * so this lets them attach the Bearer token without prop-drilling.
 * 
 * Idea from Clerk docs: https://clerk.com/docs/nextjs/middleware-protected-routes#fetching-from-api-routes
 */
type TokenGetter = () => Promise<string | null>;

let getToken: TokenGetter = () => Promise.resolve(null);

export function registerTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

/** Drop-in replacement for fetch() that attaches the Clerk Bearer token. */
export async function authFetch(
  url: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const token = await getToken();
  const headers = new Headers(init?.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(url, { ...init, headers });
}
