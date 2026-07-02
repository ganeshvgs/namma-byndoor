const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export { BASE_URL };

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
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body !== undefined
        ? JSON.stringify(options.body)
        : undefined,
  });

  if (response.status === 401 || response.status === 403) {
    handleAuthError();
    throw new ApiError(response.status, "Session expired");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const json = await response.json();
      if (json.message) message = json.message;
    } catch {}

    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) =>
    request<T>(url, { method: "GET" }),

  post: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "POST", body }),

  put: <T>(url: string, body: unknown) =>
    request<T>(url, { method: "PUT", body }),

  delete: <T>(url: string) =>
    request<T>(url, { method: "DELETE" }),
};

export default api;