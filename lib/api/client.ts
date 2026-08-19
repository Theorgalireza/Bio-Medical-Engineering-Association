const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

type ApiRequestOptions = RequestInit & { auth?: boolean };

let cachedCsrfToken: string | null = null;
let csrfTokenPromise: Promise<string | null> | null = null;

function getErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;

  const message = (body as { message?: unknown }).message;
  if (Array.isArray(message)) {
    return message.map(String).filter(Boolean).join("، ") || fallback;
  }

  return typeof message === "string" && message.trim() ? message : fallback;
}

async function getCsrfToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (cachedCsrfToken) return cachedCsrfToken;

  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch(`${API_BASE_URL}/csrf-token`, {
      credentials: "include",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const body = await response.json().catch(() => null);
        const token = body?.csrfToken;
        if (typeof token !== "string" || !token) return null;
        cachedCsrfToken = token;
        return token;
      })
      .catch(() => null)
      .finally(() => {
        csrfTokenPromise = null;
      });
  }

  return csrfTokenPromise;
}

export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { auth: _auth, ...requestInit } = options;
  const headers = new Headers(requestInit.headers);
  const method = String(requestInit.method ?? "GET").toUpperCase();
  const requestBody = requestInit.body;
  const isBinary =
    (typeof FormData !== "undefined" && requestBody instanceof FormData) ||
    (typeof Blob !== "undefined" && requestBody instanceof Blob) ||
    (typeof ArrayBuffer !== "undefined" &&
      (requestBody instanceof ArrayBuffer ||
        ArrayBuffer.isView(requestBody as ArrayBufferView)));

  if (requestBody && !isBinary) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = await getCsrfToken();
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const errorBody = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : null;
    throw new Error(
      getErrorMessage(errorBody, `درخواست ناموفق: ${response.status}`),
    );
  }

  if (response.status === 204) return undefined as T;
  if (!response.headers.get("content-type")?.includes("application/json")) {
    return (await response.text()) as T;
  }

  const responseBody = await response.json();
  return (responseBody?.data !== undefined && responseBody?.meta === undefined
    ? responseBody.data
    : responseBody) as T;
}

export function getApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
