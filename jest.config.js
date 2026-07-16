/**
 * Jest for the waitlist Pages Function — the one path where a silent failure
 * costs a real lead. Pure request/response, no React or Next runtime needed.
 *
 * Everything else on this site is static pages, covered by `next build` and
 * the deploy smoke test.
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
