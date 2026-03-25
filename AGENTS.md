# Repository Guidelines

## Project Structure & Module Organization
Core library code lives in `src/`. `src/powered-file-system.ts` defines the public `PoweredFileSystem` API, while supporting logic is split into focused modules such as `src/recurse-io.ts`, `src/recurse-io-sync.ts`, and `src/bitmask.ts`. Tests live in `test/` and generally mirror features by behavior, for example `test/read.spec.ts` and `test/mkdir.spec.ts`. Compiled JavaScript, declaration files, and source maps are emitted to `dist/`; do not hand-edit generated files.

## Build, Test, and Development Commands
- `npm install`: install local dev dependencies before doing anything else.
- `npm run build`: compile TypeScript from `src/` and `test/` into `dist/` using `tsc`.
- `npm test`: run the compiled Mocha suite from `dist/test`.

Typical workflow:

```bash
npm install
npm run build
npm test
```

## Coding Style & Naming Conventions
Use TypeScript and Node built-in module imports such as `import fs from 'node:fs'`. Match the existing style: two-space indentation, semicolons, single quotes, and compact exported APIs. Prefer `kebab-case` for source filenames (`powered-file-system.ts`) and keep test files in the `*.spec.ts` pattern. Public types and classes use `PascalCase`; variables and methods use `camelCase`.

## Testing Guidelines
This project uses Mocha with Node’s `assert` module and lightweight filesystem mocking from `test/__fmock.ts`. Add or update one focused spec file per behavior change, and keep test names descriptive, e.g. `it('[sync] Positive: For existing directory should return true', ...)`. Run `npm run build` before `npm test`, since tests execute from compiled output. There is no explicit coverage gate in the repo, so aim to cover both async and `{ sync: true }` paths where relevant.

## Commit & Pull Request Guidelines
Recent history uses short, imperative summaries such as `Updated tsconfig file and dependencies` and `Implementation using new interfaces`. Keep commit subjects concise and specific to one change. For pull requests, include:

- a short problem/solution summary
- linked issue or context when applicable
- notes about API or behavior changes
- test coverage details (`npm run build`, `npm test`)

## Generated Output & Release Hygiene
Because `package.json` publishes from `dist/src/index.js`, validate generated artifacts before merging release-related changes. If you modify exported types or runtime behavior, rebuild so `dist/` stays in sync with `src/`.
