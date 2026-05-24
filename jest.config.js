/**
 * Jest for Lumi landing / BFF pure-helper tests.
 *
 * Covers `lib/chunk.ts`, `lib/embeddings.ts`, `lib/ai-proxy.ts` — all
 * server-side pure helpers that don't need a React/Next runtime. Route
 * handlers are covered end-to-end via `next build` + smoke-deploy.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
