// Small typed fetch wrapper for the backend API.
//
// In production the reverse proxy forwards /api/ to the backend on the same
// host, so a relative base is correct and needs no configuration. Defaulting to
// it — rather than to a localhost URL — means a missing or mistyped env file can
// never ship a build that asks the visitor's own machine for the API.
// Dev is genuinely cross-origin (Vite on 5173, Express on 3070), so it keeps an
// absolute URL. VITE_API_BASE_URL still overrides both.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? 'http://localhost:3070/api/v1' : '/api/v1');

// Uploaded images are served from the API's origin (not under /api/v1) — e.g.
// "http://localhost:3070/uploads/xyz.jpeg" in dev, "/uploads/xyz.jpeg" in
// production. Derived from API_BASE_URL so this doesn't need its own
// separately-configured env var that could drift out of sync.
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function request<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  // FormData (image uploads) must NOT get a manual Content-Type — the browser sets its
  // own multipart boundary, which we'd otherwise clobber.
  const isFormData = init?.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  });

  let parseFailed = false;
  const body = await res.json().catch(() => {
    parseFailed = true;
    return undefined;
  });

  if (!res.ok) {
    throw new ApiError(
      typeof body?.error === 'string' ? body.error : 'Request failed',
      res.status,
      body?.details,
    );
  }

  // A 2xx whose body isn't JSON is still a failed request — it usually means a
  // proxy answered instead of the API (an HTML error page or the SPA shell).
  // Returning undefined here would satisfy the type signature while handing
  // callers nothing, so the crash lands later at the first property access
  // rather than in the `.catch` that every caller already has.
  if (parseFailed && res.status !== 204) {
    throw new ApiError('Unexpected non-JSON response from the API', res.status);
  }

  return body as TResponse;
}

function authHeaders(token?: string): HeadersInit | undefined {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export function get<TResponse>(path: string, token?: string): Promise<TResponse> {
  return request<TResponse>(path, { headers: authHeaders(token) });
}

export function post<TResponse, TBody = unknown>(
  path: string,
  data: TBody,
  token?: string,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });
}

export function put<TResponse, TBody = unknown>(
  path: string,
  data: TBody,
  token?: string,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });
}

export function patch<TResponse, TBody = unknown>(
  path: string,
  data: TBody,
  token?: string,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: authHeaders(token),
  });
}

export function del<TResponse = void>(path: string, token?: string): Promise<TResponse> {
  return request<TResponse>(path, { method: 'DELETE', headers: authHeaders(token) });
}

/** Local uploads come back as "/uploads/..." (relative to the API origin); external/static
 *  image URLs (old-site photos, local /images/... in frontend/public) are already absolute
 *  or root-relative to the frontend and should pass through unchanged. */
export function resolveImageUrl(url: string): string {
  return url.startsWith('/uploads') ? `${API_ORIGIN}${url}` : url;
}

export function uploadImage(file: File, token: string): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('image', file);
  return request<{ url: string }>('/uploads', {
    method: 'POST',
    body: formData,
    headers: authHeaders(token),
  });
}
