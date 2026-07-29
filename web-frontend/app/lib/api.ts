const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export { BASE_URL };

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

/* =========================================================
   CLIENT GET CACHE
========================================================= */

const CACHE_TTL = 60 * 1000;

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

/*
  Keeps track of requests currently running.

  Example:
  FeaturedPlaces -> GET /api/places
  CategoryWise   -> GET /api/places

  Both receive the SAME promise instead of making 2 requests.
*/
const pendingRequests = new Map<string, Promise<unknown>>();

function getToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
}

function getCacheKey(path: string): string {
  return path;
}

function clearExpiredCache() {
  const now = Date.now();

  for (const [key, entry] of cache.entries()) {
    if (entry.expiresAt <= now) {
      cache.delete(key);
    }
  }
}

export function clearApiCache() {
  cache.clear();
}

export function invalidateApiCache(path?: string) {
  if (!path) {
    clearApiCache();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(path)) {
      cache.delete(key);
    }
  }
}

/* =========================================================
   ERROR PARSER
========================================================= */

async function getErrorMessage(
  response: Response
): Promise<string> {
  let message = `Request failed (${response.status})`;

  try {
    const data = await response.json();

    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      message = data.message;
    }
  } catch {
    // Non-JSON error response.
  }

  return message;
}

/* =========================================================
   BASE REQUEST
========================================================= */

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const token = getToken();

  const isFormData =
    typeof FormData !== "undefined" &&
    options.body instanceof FormData;

  const headers = new Headers(options.headers);

  if (!isFormData && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,

      headers,

      body:
        options.body === undefined
          ? undefined
          : isFormData
            ? (options.body as FormData)
            : JSON.stringify(options.body),
    });
  } catch (error) {
    console.error(
      `[API] Network error: ${path}`,
      error
    );

    throw new ApiError(
      0,
      "Unable to connect to the server. Please try again."
    );
  }

  if (!response.ok) {
    const message = await getErrorMessage(response);

    throw new ApiError(
      response.status,
      message
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError(
      response.status,
      "Server returned an invalid response."
    );
  }
}

/* =========================================================
   SMART GET
========================================================= */

async function smartGet<T>(
  path: string,
  forceRefresh = false
): Promise<T> {
  clearExpiredCache();

  const key = getCacheKey(path);

  /*
    1. Return cached response.
  */
  if (!forceRefresh) {
    const cached = cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.data as T;
    }
  }

  /*
    2. Reuse request already running.
  */
  if (!forceRefresh) {
    const pending = pendingRequests.get(key);

    if (pending) {
      return pending as Promise<T>;
    }
  }

  /*
    3. Make new request.
  */

  const execute = async (): Promise<T> => {
    try {
      return await request<T>(path, {
        method: "GET",
      });
    } catch (error) {
      /*
        One gentle retry for a temporary 429.

        The backend fix below should make 429s rare.
        This is only extra resilience.
      */
      if (
        error instanceof ApiError &&
        error.status === 429
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        return request<T>(path, {
          method: "GET",
        });
      }

      throw error;
    }
  };

  const promise = execute();

  pendingRequests.set(
    key,
    promise as Promise<unknown>
  );

  try {
    const data = await promise;

    cache.set(key, {
      data,
      expiresAt: Date.now() + CACHE_TTL,
    });

    return data;
  } finally {
    pendingRequests.delete(key);
  }
}

/* =========================================================
   MUTATION
========================================================= */

async function mutation<T>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> {
  const result = await request<T>(path, {
    method,
    body,
  });

  /*
    Admin changed data.

    Clear public cache so the next GET immediately receives
    fresh categories/places/videos.
  */
  clearApiCache();

  return result;
}

/* =========================================================
   PUBLIC API
========================================================= */

export const api = {
  get: <T>(
    url: string,
    options?: {
      forceRefresh?: boolean;
    }
  ) =>
    smartGet<T>(
      url,
      options?.forceRefresh ?? false
    ),

  post: <T>(
    url: string,
    body?: unknown
  ) =>
    mutation<T>(
      "POST",
      url,
      body
    ),

  put: <T>(
    url: string,
    body?: unknown
  ) =>
    mutation<T>(
      "PUT",
      url,
      body
    ),

  patch: <T>(
    url: string,
    body?: unknown
  ) =>
    mutation<T>(
      "PATCH",
      url,
      body
    ),

  delete: <T>(
    url: string
  ) =>
    mutation<T>(
      "DELETE",
      url
    ),

  clearCache: clearApiCache,

  invalidate: invalidateApiCache,
};

export default api;