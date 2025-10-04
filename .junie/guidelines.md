Project: ZUS-symulator (Vite + Vue 3 + TypeScript)

This document captures repo-specific build/config details, testing approaches that fit this codebase, and development tips tailored to this repository. It is written for experienced contributors and focuses only on project-specific details.

1) Build and configuration
- Node engine: package.json enforces Node ^20.19.0 or >=22.12.0. Use one of these versions to avoid toolchain issues.
- Install dependencies (run in ZUS-symulator/):
  - npm install
- Development server:
  - npm run dev → starts Vite with HMR.
- Production build and preview:
  - npm run build → runs vue-tsc type-checks and builds to dist/
  - npm run preview → serves the built app for local verification
- Type checking:
  - npm run type-check uses vue-tsc, required for proper .vue SFC type support (tsc alone is insufficient for SFCs).
- Lint and format:
  - npm run lint uses ESLint 9 with eslint-plugin-vue and @vue/eslint-config-typescript; it runs with --fix.
  - npm run format uses Prettier 3 on src/.
- Path alias:
  - Vite config sets @ → ZUS-symulator/src (see vite.config.ts). Use this in imports (e.g., import X from '@/components/X.vue').
- ESM everywhere:
  - The project is ESM ("type": "module"). Node scripts should use ESM imports and/or .mjs.
- IDE:
  - Use Volar for TS support in .vue SFCs. Disable Vetur.

2) Testing information
This repository does not include a test framework by default. Below are two options you can adopt, without committing test artifacts to the repo unless you explicitly want to.

A. One-off smoke test without dependencies (local-only, not committed)
- Purpose: Quickly validate a utility or small unit of code using Node’s built-in assert, without installing or configuring a framework.
- How to run locally (do not commit these files):
  1) Create a small JS file to test (plain .js so Node can run it without transpilation), e.g. ZUS-symulator/src/utils/math.js with:
     export function add(a, b) { return a + b }
     export function multiply(a, b) { return a * b }
  2) Create a Node ESM script, e.g. ZUS-symulator/scripts/demo-test.mjs:
     import assert from 'node:assert/strict'
     import { add, multiply } from '../src/utils/math.js'
     assert.equal(add(2, 3), 5)
     assert.equal(multiply(4, 5), 20)
     console.log('All assertions passed')
  3) Run from the repo root (PowerShell):
     node ZUS-symulator\scripts\demo-test.mjs
  4) Expected output:
     All assertions passed
  5) Cleanup: Delete the demo files after verifying. They are for illustration only.

B. Sustainable unit testing with Vitest (recommended for ongoing work)
- Install (dev only):
  npm i -D vitest @vitest/ui @vue/test-utils happy-dom
- Add scripts to package.json:
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:watch": "vitest --watch",
  "test:run": "vitest run"
- Basic example (do not commit unless you intend to keep tests):
  // ZUS-symulator/src/utils/math.test.ts
  import { describe, it, expect } from 'vitest'
  import { add, multiply } from './math'
  describe('math', () => {
    it('add', () => { expect(add(2,3)).toBe(5) })
    it('multiply', () => { expect(multiply(4,5)).toBe(20) })
  })
- Component example (requires @vue/test-utils + happy-dom):
  import { mount } from '@vue/test-utils'
  import { describe, it, expect } from 'vitest'
  import App from '@/App.vue'
  describe('App', () => {
    it('mounts', () => { const w = mount(App); expect(w.exists()).toBe(true) })
  })
- Run tests:
  npm run test (watch) or npm run test:run (CI-style)

3) Additional development information
- Routing: Configured in src/router/index.ts using Vue Router 4. If routes expand, consider lazy loading via dynamic imports for code-splitting.
- State: Pinia 3 is included; stores live under src/stores/ (counter.ts is a starter). Prefer defineStore with typed state/getters/actions.
- TypeScript in SFCs:
  - Use script setup with defineProps/defineEmits for strong typing.
  - Run npm run type-check before release; it catches template type errors that TS alone won’t.
- Vite config specifics (vite.config.ts):
  - Plugins: @vitejs/plugin-vue and vite-plugin-vue-devtools are enabled. Devtools work best in Chromium/Firefox (see ZUS-symulator/README.md for links and required settings like Custom Object Formatter).
- Linting/formatting:
  - ESLint 9 + Vue + TS config is already set; run npm run lint to auto-fix many issues. Prettier integration is via @vue/eslint-config-prettier—avoid conflicting editor Prettier settings.
- Windows usage tips:
  - Use backslashes in PowerShell for script paths (e.g., node ZUS-symulator\scripts\demo-test.mjs).
  - If npm run dev hits a port in use, re-run to pick a different port or set PORT.
- CI suggestion:
  - Minimal CI sequence (once set up): npm ci && npm run type-check && npm run lint && npm run build. Add npm run test:run once Vitest is adopted.

Housekeeping
- Keep the repository free of ad-hoc demo files. If you perform local smoke tests, delete the temporary files afterwards. If/when you adopt Vitest, commit proper tests next to source files (e.g., *.test.ts) or under a tests/ directory.
