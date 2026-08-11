import { HttpClient } from '@/services/http-client';
import { HTTP_METHOD } from '@/constants/http';
import { ENV } from '@/constants/env';

jest.mock('@/constants/env', () => ({
  ENV: {
    API_BASE_URL: 'http://localhost:3000',
  },
}));

function mockFetchResolvedOnce(response: Partial<Response>) {
  (globalThis.fetch as jest.Mock).mockResolvedValueOnce(response as Response);
}

describe('HttpClient', () => {
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient(ENV.API_BASE_URL);
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('URL and param construction', () => {
    it('builds a plain URL with no params', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.get('/vehicles');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${ENV.API_BASE_URL}/vehicles`,
        expect.objectContaining({ method: HTTP_METHOD.GET }),
      );
    });

    it('appends single-value params as query string entries', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.get('/vehicles', { make: 'Toyota', _page: 1 });

      const calledUrl = (globalThis.fetch as jest.Mock).mock
        .calls[0][0] as string;
      expect(calledUrl).toBe(
        `${ENV.API_BASE_URL}/vehicles?make=Toyota&_page=1`,
      );
    });

    it('skips undefined param values entirely', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.get('/vehicles', { make: 'Toyota', model: undefined });

      const calledUrl = (globalThis.fetch as jest.Mock).mock
        .calls[0][0] as string;
      expect(calledUrl).toBe(`${ENV.API_BASE_URL}/vehicles?make=Toyota`);
    });

    it('appends array param values as repeated keys', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.get('/vehicles', { make: ['Toyota', 'Honda'] });

      const calledUrl = (globalThis.fetch as jest.Mock).mock
        .calls[0][0] as string;
      expect(calledUrl).toBe(
        `${ENV.API_BASE_URL}/vehicles?make=Toyota&make=Honda`,
      );
    });
  });

  describe('successful responses', () => {
    it('returns parsed JSON on a 200 response', async () => {
      const payload = { id: '1', make: 'Toyota' };
      mockFetchResolvedOnce({
        ok: true,
        status: 200,
        json: async () => payload,
      });

      const result = await client.get('/vehicles/1');

      expect(result).toEqual(payload);
    });

    it('returns undefined for a 204 No Content response', async () => {
      mockFetchResolvedOnce({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('no body');
        },
      });

      const result = await client.delete('/vehicles/1');

      expect(result).toBeUndefined();
    });
  });

  describe('error responses', () => {
    it('throws an HttpError with the status and parsed body on a non-ok response', async () => {
      const errorBody = { message: 'Not found' };
      mockFetchResolvedOnce({
        ok: false,
        status: 404,
        json: async () => errorBody,
      });

      await expect(client.get('/vehicles/missing')).rejects.toMatchObject({
        name: 'HttpError',
        status: 404,
        body: errorBody,
      });
    });

    it('throws an HttpError even when the error response has no JSON body', async () => {
      mockFetchResolvedOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('invalid json');
        },
      });

      await expect(client.get('/vehicles')).rejects.toMatchObject({
        name: 'HttpError',
        status: 500,
        body: undefined,
      });
    });

    it('throws an HttpError with status 0 when fetch itself rejects (network failure)', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new TypeError('Failed to fetch'),
      );

      await expect(client.get('/vehicles')).rejects.toMatchObject({
        name: 'HttpError',
        status: 0,
      });
    });
  });

  describe('HTTP methods and body serialization', () => {
    it('sends a JSON-stringified body on post', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.post('/vehicles', { make: 'Toyota' });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${ENV.API_BASE_URL}/vehicles`,
        expect.objectContaining({
          method: HTTP_METHOD.POST,
          body: JSON.stringify({ make: 'Toyota' }),
        }),
      );
    });

    it('sends a JSON-stringified body on patch', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.patch('/vehicles/1', { status: 'Aging' });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${ENV.API_BASE_URL}/vehicles/1`,
        expect.objectContaining({
          method: HTTP_METHOD.PATCH,
          body: JSON.stringify({ status: 'Aging' }),
        }),
      );
    });

    it('sends no body on delete', async () => {
      mockFetchResolvedOnce({
        ok: true,
        status: 204,
        json: async () => {
          throw new Error('no body');
        },
      });

      await client.delete('/vehicles/1');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${ENV.API_BASE_URL}/vehicles/1`,
        expect.objectContaining({
          method: HTTP_METHOD.DELETE,
          body: undefined,
        }),
      );
    });

    it('always sends the Content-Type header', async () => {
      mockFetchResolvedOnce({ ok: true, status: 200, json: async () => ({}) });

      await client.get('/vehicles');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });
  });
});
