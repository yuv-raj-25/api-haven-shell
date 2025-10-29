const DEFAULT_API_BASE_URL = "http://localhost:4000/api";

const getBaseUrl = () => {
  const url = import.meta.env?.VITE_API_BASE_URL;
  if (typeof url === "string" && url.length > 0) {
    return url;
  }
  return DEFAULT_API_BASE_URL;
};

interface RequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const url = new URL(path, getBaseUrl());
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
};

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const { query, headers, body, ...rest } = options;
  const response = await fetch(buildUrl(path, query), {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body instanceof FormData ? body : body,
    ...rest,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    throw new ApiError(
      response.statusText || "Request failed",
      response.status,
      payload
    );
  }

  return payload as TResponse;
}
