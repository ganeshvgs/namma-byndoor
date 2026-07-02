// lib/api.ts
// Centralised API helper — attaches Bearer token, handles 401/403/500.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function handleAuthError() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  window.location.href = "/login";
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    handleAuthError();
    throw new ApiError(response.status, "Session expired. Please log in again.");
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new ApiError(response.status, message);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export const api = {
  get: <T = unknown>(path: string) => request<T>(path, { method: "GET" }),

  post: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body }),

  put: <T = unknown>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body }),

  delete: <T = unknown>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

export default BASE_URL;