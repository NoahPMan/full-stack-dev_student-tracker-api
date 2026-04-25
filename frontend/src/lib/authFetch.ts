type TokenGetter = () => Promise<string | null>;

let getToken: TokenGetter = async () => null;

export function registerTokenGetter(fn: TokenGetter) {
  getToken = fn;
}

export async function authFetch(url: RequestInfo, init?: RequestInit): Promise<Response> {
  const token = await getToken();

  const headers = new Headers(init?.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, { ...init, headers });
}