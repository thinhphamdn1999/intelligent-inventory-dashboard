import { ENV } from '@/constants/env';
import { HTTP_ERROR_MESSAGE, HTTP_METHOD } from '@/constants/http';

export class HttpError extends Error {
  public status: number;
  public body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.body = body;
  }
}

type QueryParams = Record<
  string,
  string | number | boolean | (string | number)[] | undefined
>;

type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: QueryParams;
  body?: unknown;
};

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: QueryParams): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined) return;
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)));
        } else {
          url.searchParams.set(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { params, body, headers, ...rest } = options;
    const url = this.buildUrl(path, params);

    let response: Response;
    try {
      response = await fetch(url, {
        ...rest,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new HttpError(HTTP_ERROR_MESSAGE.NETWORK_REQUEST_FAILED, 0);
    }

    if (!response.ok) {
      let errorBody: unknown;
      try {
        errorBody = await response.json();
      } catch {
        // Response had no JSON body
      }
      throw new HttpError(
        HTTP_ERROR_MESSAGE.REQUEST_RETURNED_AN_ERROR_STATUS(response.status),
        response.status,
        errorBody,
      );
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  get<T>(path: string, params?: QueryParams): Promise<T> {
    return this.request<T>(path, { method: HTTP_METHOD.GET, params });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: HTTP_METHOD.POST, body });
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: HTTP_METHOD.PATCH, body });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: HTTP_METHOD.DELETE });
  }
}

const httpClient = new HttpClient(ENV.API_BASE_URL);

export default httpClient;
