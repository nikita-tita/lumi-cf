/**
 * Отдельный jest-конфиг только для `__tests__/audit-card.dom.test.ts` — теста,
 * который реально гоняет детектор `scripts/audit-card.js` через playwright
 * (настоящий Chromium) на подложенных фикстурах, а не только проверяет
 * обвязку. См. doc-comment в самом тестовом файле и в `jest.config.js` —
 * почему это отдельный конфиг/скрипт, а не часть дефолтного `npm test`.
 *
 * Запуск: `npm run test:audit-card` (требует локально установленный Chromium:
 * `npx playwright install chromium`). В CI гоняется в `audit-card.yml`, где
 * Chromium и так ставится для замера живой визитки.
 */
const base = require('./jest.config.js');

module.exports = {
  ...base,
  testMatch: ['<rootDir>/__tests__/audit-card.dom.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};
