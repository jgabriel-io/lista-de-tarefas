const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type ApiFetchOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  const { token, ...fetchOptions } = options || {};

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
