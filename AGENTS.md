# Repository Guidelines

## Project Structure & Module Organization
Core library code lives in `src/`. `src/powered-file-system.ts` defines the public `PoweredFileSystem` API, while supporting logic is split into focused modules such as `src/recurse-io.ts`, `src/recurse-io-sync.ts`, and `src/bitmask.ts`. Tests live next to source files as `*.test.ts`, including feature tests under `src/powered-file-system/`. Compiled JavaScript, declarations, and compiled tests are emitted to `dist/`. Do not hand-edit generated files.

## Build, Test, and Development Commands
- `yarn install --frozen-lockfile`: install local dev dependencies from the committed lockfile.
- `yarn lint`: run ESLint over TypeScript sources.
- `yarn build`: compile runtime TypeScript into `dist/`.
- `yarn test`: run the compiled Node test suite from `dist/`.

Typical workflow:

```bash
yarn install --frozen-lockfile
yarn lint
yarn build
yarn test
```

## Coding Style & Naming Conventions
Use TypeScript and Node built-in module imports such as `import fs from 'node:fs'`. Match the existing style: two-space indentation, semicolons, single quotes, and compact exported APIs. Prefer `kebab-case` for source filenames (`powered-file-system.ts`) and keep test files in the `*.test.ts` pattern. Public types and classes use `PascalCase`; variables and methods use `camelCase`.

## Testing Guidelines
This project uses Node's native `node:test` runner with Node's `assert` module and lightweight fixture helpers from `src/test-utils.ts`. Add or update focused tests near the behavior under change, and keep test names descriptive, e.g. `it('[sync] Positive: For existing directory should return true', ...)`. Run `yarn build` before `yarn test`, since tests execute from compiled output. There is no explicit coverage gate in the repo, so aim to cover both async and `{ sync: true }` paths where relevant.

## Commit & Pull Request Guidelines
Recent history uses short, imperative summaries such as `Updated tsconfig file and dependencies` and `Implementation using new interfaces`. Keep commit subjects concise and specific to one change. For pull requests, include:

- a short problem/solution summary
- linked issue or context when applicable
- notes about API or behavior changes
- test coverage details (`yarn lint`, `yarn build`, `yarn test`)

## Generated Output & Release Hygiene
`package.json` publishes files from `dist/`. If you modify exported types or runtime behavior, rebuild so `dist/` stays in sync with `src/`.
