/**
 * Unit tests for `lib/ai-proxy.ts` — CORS / rate-limit / user resolution
 * / Bearer verification (B-058).
 */

import {
  corsHeaders,
  handleOptions,
  getUserId,
  rateLimit,
  resolveAuthedUser,
  verifyBearerToken,
} from '../../lib/ai-proxy';

function requestWithHeaders(headers: Record<string, string>): Request {
  return new Request('https://bff.test/', { method: 'POST', headers });
}

describe('corsHeaders + handleOptions', () => {
  it('returns a CORS preflight 204 with allow-origin: *', async () => {
    const res = handleOptions();
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    expect(res.headers.get('access-control-allow-methods')).toContain('POST');
    expect(res.headers.get('access-control-allow-headers')).toContain('x-user-id');
  });

  it('exposes a plain object shape for manual header merge', () => {
    const h = corsHeaders();
    expect(h['access-control-allow-origin']).toBe('*');
    expect(h['access-control-max-age']).toBe('86400');
  });
});

describe('getUserId', () => {
  it('extracts x-user-id when present', () => {
    const req = requestWithHeaders({ 'x-user-id': 'user-42' });
    expect(getUserId(req)).toBe('user-42');
  });

  it('falls back to "anonymous"', () => {
    const req = requestWithHeaders({});
    expect(getUserId(req)).toBe('anonymous');
  });

  it('clips headers longer than 64 chars', () => {
    const req = requestWithHeaders({ 'x-user-id': 'x'.repeat(200) });
    expect(getUserId(req)).toHaveLength(64);
  });
});

describe('rateLimit', () => {
  it('allows first 10 requests per user per minute', () => {
    const user = 'rl-test-' + Math.random();
    for (let i = 0; i < 10; i++) {
      expect(rateLimit(user)).toBeNull();
    }
    const eleventh = rateLimit(user);
    expect(eleventh).not.toBeNull();
    expect(eleventh!.status).toBe(429);
  });

  it('isolates counters per user', () => {
    const a = 'rl-a-' + Math.random();
    const b = 'rl-b-' + Math.random();
    for (let i = 0; i < 10; i++) expect(rateLimit(a)).toBeNull();
    expect(rateLimit(a)!.status).toBe(429);
    // user b still fresh
    expect(rateLimit(b)).toBeNull();
  });

  it('sets Retry-After header on 429', () => {
    const u = 'rl-retry-' + Math.random();
    for (let i = 0; i < 10; i++) rateLimit(u);
    const res = rateLimit(u);
    expect(res!.headers.get('Retry-After')).toBeDefined();
    expect(Number(res!.headers.get('Retry-After'))).toBeGreaterThan(0);
  });
});

describe('verifyBearerToken (B-058)', () => {
  const originalFetch = global.fetch;
  const originalMain = process.env.MAIN_API_URL;

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalMain !== undefined) process.env.MAIN_API_URL = originalMain;
    else delete process.env.MAIN_API_URL;
  });

  it('returns null for empty/short tokens', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    expect(await verifyBearerToken('')).toBeNull();
    expect(await verifyBearerToken('abc')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('hits main API /auth/me and caches user id', async () => {
    process.env.MAIN_API_URL = 'https://api.test';
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => ({ user: { id: 'user-real-42' } }),
    }));
    global.fetch = fetchMock as unknown as typeof fetch;
    // Unique token so we don't collide with other tests.
    const token = 'jwt-verify-cache-' + Math.random();
    const first = await verifyBearerToken(token);
    const second = await verifyBearerToken(token);
    expect(first).toBe('user-real-42');
    expect(second).toBe('user-real-42');
    // Second call should be cached — only 1 fetch.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      { headers: Record<string, string> },
    ];
    expect(url).toBe('https://api.test/auth/me');
    expect(init.headers.authorization).toBe(`Bearer ${token}`);
  });

  it('returns null on main API 401', async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })) as unknown as typeof fetch;
    expect(await verifyBearerToken('jwt-bad-' + Math.random())).toBeNull();
  });

  it('returns null when main API returns malformed body', async () => {
    global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) })) as unknown as typeof fetch;
    expect(await verifyBearerToken('jwt-malformed-' + Math.random())).toBeNull();
  });

  it('returns null on network throw', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('fetch failed');
    }) as unknown as typeof fetch;
    expect(await verifyBearerToken('jwt-throw-' + Math.random())).toBeNull();
  });

  // ── S7-04 / B-065 test-mode bypass ─────────────────────────────────

  it('resolves BFF_TEST_BEARER to BFF_TEST_USER_ID without hitting main API', async () => {
    const originalBearer = process.env.BFF_TEST_BEARER;
    const originalUser = process.env.BFF_TEST_USER_ID;
    process.env.BFF_TEST_BEARER = 'test-token-s7';
    process.env.BFF_TEST_USER_ID = 'user-runner-abc';
    const fetchMock = jest.fn(); // should NOT be called
    global.fetch = fetchMock as unknown as typeof fetch;
    try {
      const id = await verifyBearerToken('test-token-s7');
      expect(id).toBe('user-runner-abc');
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      if (originalBearer === undefined) delete process.env.BFF_TEST_BEARER;
      else process.env.BFF_TEST_BEARER = originalBearer;
      if (originalUser === undefined) delete process.env.BFF_TEST_USER_ID;
      else process.env.BFF_TEST_USER_ID = originalUser;
    }
  });

  it('test-mode bypass falls back to "test-user" when BFF_TEST_USER_ID unset', async () => {
    const originalBearer = process.env.BFF_TEST_BEARER;
    const originalUser = process.env.BFF_TEST_USER_ID;
    process.env.BFF_TEST_BEARER = 'test-token-default';
    delete process.env.BFF_TEST_USER_ID;
    try {
      const id = await verifyBearerToken('test-token-default');
      expect(id).toBe('test-user');
    } finally {
      if (originalBearer === undefined) delete process.env.BFF_TEST_BEARER;
      else process.env.BFF_TEST_BEARER = originalBearer;
      if (originalUser !== undefined) process.env.BFF_TEST_USER_ID = originalUser;
    }
  });

  it('S11/C1 — prod env fails closed when BFF_TEST_BEARER is set', async () => {
    const originalBearer = process.env.BFF_TEST_BEARER;
    const originalEnv = process.env.NODE_ENV;
    process.env.BFF_TEST_BEARER = 'test-token-prod';
    // Override NODE_ENV for this test only — restore in finally.
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const id = await verifyBearerToken('test-token-prod');
      expect(id).toBeNull();
      expect(errorSpy).toHaveBeenCalled();
      expect((errorSpy.mock.calls[0][0] as string)).toContain('BFF_TEST_BEARER');
    } finally {
      errorSpy.mockRestore();
      if (originalBearer === undefined) delete process.env.BFF_TEST_BEARER;
      else process.env.BFF_TEST_BEARER = originalBearer;
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    }
  });

  it('S11/C1 — prod env without BFF_TEST_BEARER works normally', async () => {
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', configurable: true });
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ user: { id: 'user-real' } }),
    })) as unknown as typeof fetch;
    try {
      const id = await verifyBearerToken('real-jwt-token');
      expect(id).toBe('user-real');
    } finally {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        configurable: true,
      });
    }
  });

  it('test-mode bypass does NOT match wrong token', async () => {
    const originalBearer = process.env.BFF_TEST_BEARER;
    process.env.BFF_TEST_BEARER = 'test-token-s7';
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 401,
      json: async () => ({}),
    })) as unknown as typeof fetch;
    try {
      const id = await verifyBearerToken('wrong-token');
      expect(id).toBeNull();
    } finally {
      if (originalBearer === undefined) delete process.env.BFF_TEST_BEARER;
      else process.env.BFF_TEST_BEARER = originalBearer;
    }
  });
});

describe('resolveAuthedUser (B-058)', () => {
  const originalFetch = global.fetch;
  const originalMain = process.env.MAIN_API_URL;
  const originalRequire = process.env.BFF_REQUIRE_AUTH;

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalMain !== undefined) process.env.MAIN_API_URL = originalMain;
    else delete process.env.MAIN_API_URL;
    if (originalRequire !== undefined) process.env.BFF_REQUIRE_AUTH = originalRequire;
    else delete process.env.BFF_REQUIRE_AUTH;
  });

  it('verified=true when Bearer is valid', async () => {
    process.env.MAIN_API_URL = 'https://api.test';
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ user: { id: 'user-bearer-A' } }),
    })) as unknown as typeof fetch;
    const req = requestWithHeaders({
      authorization: 'Bearer jwt-resolve-valid-' + Math.random(),
      'x-user-id': 'spoofed-id',
    });
    const result = await resolveAuthedUser(req);
    expect(result?.userId).toBe('user-bearer-A'); // not the spoofed x-user-id
    expect(result?.verified).toBe(true);
  });

  it('returns null when Bearer sent but main API rejects', async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 401, json: async () => ({}) })) as unknown as typeof fetch;
    const req = requestWithHeaders({
      authorization: 'Bearer jwt-resolve-bad-' + Math.random(),
      'x-user-id': 'spoofed',
    });
    expect(await resolveAuthedUser(req)).toBeNull();
  });

  it('falls back to x-user-id when no Bearer (verified=false)', async () => {
    const req = requestWithHeaders({ 'x-user-id': 'legacy-user' });
    const result = await resolveAuthedUser(req);
    expect(result?.userId).toBe('legacy-user');
    expect(result?.verified).toBe(false);
  });

  it('returns null when neither Bearer nor x-user-id set', async () => {
    const req = requestWithHeaders({});
    expect(await resolveAuthedUser(req)).toBeNull();
  });

  it('rejects x-user-id fallback when BFF_REQUIRE_AUTH=true', async () => {
    process.env.BFF_REQUIRE_AUTH = 'true';
    const req = requestWithHeaders({ 'x-user-id': 'legacy-user' });
    expect(await resolveAuthedUser(req)).toBeNull();
  });

  it('still permits verified Bearer when BFF_REQUIRE_AUTH=true', async () => {
    process.env.BFF_REQUIRE_AUTH = 'true';
    process.env.MAIN_API_URL = 'https://api.test';
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ user: { id: 'user-strict' } }),
    })) as unknown as typeof fetch;
    const req = requestWithHeaders({ authorization: 'Bearer jwt-resolve-strict-' + Math.random() });
    const result = await resolveAuthedUser(req);
    expect(result?.userId).toBe('user-strict');
    expect(result?.verified).toBe(true);
  });
});
