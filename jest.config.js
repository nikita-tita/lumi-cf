/**
 * Jest for the waitlist Pages Function — the one path where a silent failure
 * costs a real lead. Pure request/response, no React or Next runtime needed.
 *
 * Everything else on this site is static pages, covered by `next build` and
 * the deploy smoke test.
 *
 * `audit-card.dom.test.ts` is excluded on purpose: it drives a real Chromium
 * via playwright, and this config backs the plain `npm test` that `deploy.yml`
 * runs blocking, on every push to main — pulling a browser into that hot path
 * is exactly the cost the audit-card CI setup was designed to avoid (see the
 * comment in `deploy.yml`). That file has its own config
 * (`jest.config.audit-card.js`) and its own script (`npm run test:audit-card`),
 * run only where Chromium is already being installed anyway
 * (`.github/workflows/audit-card.yml`).
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '<rootDir>/__tests__/audit-card.dom.test.ts'],
};
