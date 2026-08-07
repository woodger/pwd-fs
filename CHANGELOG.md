# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Release versions use [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
identifiers.

Historical entries were reconstructed from the tagged Git history. Release
dates correspond to the commits referenced by those tags.

## [Unreleased]

### Changed

- Replaced Biome with Oxlint 1.77.0 as the sole linter, using 60 explicit
  lint rules without type-aware linting.
- Made npm the only supported package manager and committed `package-lock.json`
  for reproducible development and CI installs.

### Removed

- Removed the Biome dependency and configuration.
- Removed the Yarn Classic lockfile and active Yarn workflow documentation.

## [3.5.8] - 2026-07-30

### Added

- Added consumer guides for setup, file workflows, synchronous execution, and
  error handling.
- Added a root package `exports` map and a `prepare` build lifecycle.
- Added this changelog for curated release history.

### Changed

- Replaced ESLint and its supporting packages with Biome 2.5.6.
- Updated the development compiler from TypeScript 6 to TypeScript 7.0.2 and
  the test runner dependency to `fwa` 2.1.
- Committed `yarn.lock` for reproducible development and CI installs while
  keeping it out of the npm package.
- Published `docs/guides/` with the npm package while keeping contributor
  policies, source files, tests, local configuration, and lockfiles excluded.
- Completed npm metadata for documentation, CommonJS module type, issue
  reporting, homepage, and repository links.
- Simplified the TypeScript 7 compiler configuration around its defaults and
  enabled stricter index-signature access and no-emit-on-error checks.

### Fixed

- Made `readdir(..., { encoding: null })` return `Buffer[]` in asynchronous and
  synchronous modes as documented.

### Removed

- Removed the ESLint configuration and the `eslint`, `@eslint/js`,
  `typescript-eslint`, and `globals` development dependencies.

## [3.5.7] - 2026-07-16

### Changed

- Updated `fwa` to 2.0.5.
- Aligned the filesystem test suite with the project testing policy.

## [3.5.6] - 2026-07-02

### Changed

- Set supported Node.js versions to `>=14.18.0` and aligned the development
  Node.js types.
- Adopted `fwa` for compiled test discovery and simplified the ESLint setup.
- Refreshed the public API documentation and added contributor policies.
- Tightened npm exclusions for tests, source maps, build helpers, source files,
  and local configuration.

## [3.5.5] - 2026-06-29

### Changed

- Stopped tracking generated `dist` output and introduced explicit npm
  publication exclusions.
- Simplified package metadata and prepared the project for source-driven
  development builds.

## [3.5.4] - 2026-05-10

### Changed

- Pinned the ESLint stack to exact Node.js 18-compatible versions.

## [3.5.3] - 2026-05-10

### Changed

- Selected a Node.js 18-compatible `typescript-eslint` release line.

## [3.5.2] - 2026-05-10

### Fixed

- Restored Node.js 18 CI compatibility by moving the ESLint toolchain from
  version 10 to version 9.

## [3.5.1] - 2026-05-10

### Added

- Added the Yarn Classic lockfile for reproducible dependency resolution.

## [3.5.0] - 2026-05-10

### Added

- Added the public `resolve()` method for resolving paths against an instance
  working directory.

### Changed

- Raised the supported Node.js version to 18 and moved the development
  compiler to TypeScript 6.
- Reworked public overloads so synchronous and asynchronous return values, as
  well as string and buffer results, are inferred more precisely.
- Clarified that absolute paths are preserved and `pwd` is not a security
  sandbox.

### Fixed

- Made synchronous access checks honor the requested access flag.
- Corrected umask application and post-write file permissions.
- Hardened copy, recursive removal, ownership changes, and callback completion
  for existing targets, symbolic links, and error paths.

## [3.4.0] - 2026-03-25

### Added

- Added `emptyDir()`, `readlink()`, and `realpath()` in asynchronous and
  synchronous forms.
- Added `overwrite` and `filter` options to `copy()`.

### Changed

- Expanded the API reference and table of contents for the new operations.

## [3.3.5] - 2026-03-25

### Fixed

- Reverted an unverified Windows CI workaround.

## [3.3.4] - 2026-03-25

### Fixed

- Corrected Windows CI execution on Node.js 18.
- Removed npm cache handling that was not needed by the GitHub Actions
  workflow.

## [3.3.3] - 2026-03-25

### Changed

- Split `PoweredFileSystem` operations into focused modules without changing
  the public method surface.
- Migrated tests to the built-in `node:test` runner and colocated them with
  source modules.
- Added cross-platform GitHub Actions coverage and refreshed the public API
  documentation.

## [3.3.1] - 2026-03-25

### Added

- Added an ESLint-based TypeScript lint configuration.

### Fixed

- Made synchronous `test()` calls respect access modes.
- Corrected file and directory mode calculation from umasks.
- Made recursive removal unlink symbolic links instead of following them.
- Simplified recursive directory creation and ensured written files receive
  their requested mode.

## [3.3.0] - 2025-09-18

### Changed

- Reworked TypeScript interfaces and generic return types for synchronous and
  asynchronous calls.
- Updated the TypeScript, Node.js type, test, and development toolchain.

## [3.2.4] - 2024-09-11

### Changed

- Added an explicit development dependency on the Node.js type definitions.

## [3.2.3] - 2024-06-09

### Added

- Documented the exported `bitmask()` permission helper.

## [3.2.2] - 2024-06-09

### Fixed

- Corrected the `read()` implementation signature to match its TypeScript
  overloads.

## [3.2.1] - 2024-06-05

### Changed

- Moved compiled package output from `lib` to `dist`.
- Removed compiled test files from the distributable build directory.

## [3.2.0] - 2024-06-05

### Added

- Added a standalone exported `bitmask()` module.

### Changed

- Changed `chown()` from positional `uid` and `gid` arguments to values in the
  options object.
- Replaced the custom recursive removal path with Node.js `fs.rm()` behavior.

## [3.1.4] - 2024-06-02

### Added

- Added the shared `pfs` instance and named exports from the package root.

### Changed

- Returned package output to CommonJS using `tsc`.
- Replaced Jest with Mocha for the test suite.

## [3.1.3] - 2024-05-21

### Changed

- Raised the supported Node.js version to 13.2.
- Reorganized the implementation around a separate
  `PoweredFileSystem` class module.
- Switched package output to ES modules built with Rollup.

### Removed

- Removed the per-operation `resolve` option; filesystem methods resolve paths
  through the instance working directory.

## [2.4.2] - 2022-11-16

### Fixed

- Corrected the deprecated `append()` marker for npm README rendering.

## [2.4.1] - 2022-11-16

### Deprecated

- Deprecated `append()` in favor of `write()` with `{ flag: 'a' }`.

### Changed

- Updated the development configuration from Node.js 12 to Node.js 16.

## [2.3.0] - 2022-11-14

### Changed

- Updated the TypeScript, Node.js type, test, and development dependencies.

## [2.2.0] - 2021-03-24

### Added

- Exported the public `Mode`, `Flag`, and `Constants` TypeScript types.

### Deprecated

- Began warning at runtime that `append()` would be removed in favor of
  `write()` with `{ flag: 'a' }`.

## [2.1.11] - 2021-03-02

### Added

- Added the npm version badge to the README.

## [2.1.10] - 2021-02-25

### Fixed

- Split string and buffer encoding overloads for `read()`, `write()`, and
  `append()`.

## [2.1.9] - 2021-02-18

### Fixed

- Corrected npm publication configuration and included the compiled `lib`
  output.

## [2.1.7] - 2021-02-18

### Changed

- Adjusted npm publication settings for the compiled library.
- Disabled npm lockfile generation for the Yarn-based development workflow.

## [2.1.5] - 2021-02-18

### Added

- Added CommonJS module export compatibility to the TypeScript output.

### Changed

- Exposed filesystem access constants on `PoweredFileSystem` instances.

## [2.1.4] - 2021-02-16

### Added

- Added the package `types` entry and included generated declarations in the
  npm package.

## [2.1.3] - 2021-02-15

### Changed

- Migrated the test suite from JavaScript to TypeScript.
- Added explicit overloads for synchronous and asynchronous methods.
- Moved compiled application and test output to `lib`.

## [2.1.1] - 2021-02-10

### Changed

- Added TypeScript compilation to CI.
- Enabled stricter TypeScript checks for implicit `this` and function types.
- Switched Travis dependency installation from npm to Yarn.

## [2.0.1] - 2021-02-09

### Changed

- Enabled stricter TypeScript checks for implicit `any` and generator types.
- Excluded `yarn.lock` from the npm package.

## [2.0.0] - 2021-02-09

### Changed

- Migrated the implementation from JavaScript to TypeScript.
- Added generated JavaScript, declarations, and source maps to the build
  output.

### Removed

- Removed the runtime `type-enforcement` dependency in favor of compile-time
  types.

## [1.3.0] - 2021-02-07

### Changed

- Restored runtime encoding validation for `read()`, `write()`, `append()`, and
  `readdir()`.

## [1.2.14] - 2020-11-29

### Fixed

- Allowed non-string encoding values such as `null` to reach Node.js file
  operations instead of failing runtime type validation.

## [1.2.13] - 2020-06-05

### Changed

- Updated test assertions and development dependencies.

## [1.2.12] - 2019-06-21

### Added

- Added synchronous execution for filesystem methods through the `sync`
  option.

### Fixed

- Corrected the public declaration of the synchronous option.

## [1.1.11] - 2019-06-09

### Added

- Added constructor argument validation.

### Changed

- Expanded test coverage for the public filesystem operations.

## [1.1.10] - 2019-06-07

### Changed

- Moved internal implementation modules from `lib` to `src`.
- Updated Travis CI configuration and corrected documentation links.

## [1.0.9] - 2019-04-22

### Changed

- Excluded local coverage output from the npm package.

## [1.0.8] - 2019-04-22

### Fixed

- Improved `mkdir()` handling for the current working directory and paths
  beneath it.

## [1.0.7] - 2019-04-18

### Changed

- Reduced `mkdir()` latency by simplifying directory traversal.
- Added explicit npm package exclusions.

## [1.0.6] - 2019-02-24

### Changed

- Refreshed runtime validation and test dependencies.
- Improved method-specific validation errors and test support.

## [1.0.4] - 2018-10-24

### Changed

- Improved `mkdir()` performance by approximately seven percent.

## [1.0.3] - 2018-10-08

### Fixed

- Corrected the test suite and refreshed license and README content.

## [1.0.2] - 2018-10-05

### Changed

- Simplified the Windows CI platform matrix.

## [1.0.1] - 2018-10-05

### Added

- Added Windows CI coverage.
- Added the Node.js `>=8.12.0` engine requirement.

### Changed

- Updated installation, platform, and permission documentation.

## [1.0.0] - 2018-10-03

### Added

- Initial release of the working-directory-aware filesystem wrapper.
- Added promise-based file operations and recursive helpers for permissions,
  copying, removal, and directory creation.

[Unreleased]: https://github.com/woodger/pwd-fs/compare/v3.5.8...HEAD
[3.5.8]: https://github.com/woodger/pwd-fs/compare/v3.5.7...v3.5.8
[3.5.7]: https://github.com/woodger/pwd-fs/compare/v3.5.6...v3.5.7
[3.5.6]: https://github.com/woodger/pwd-fs/compare/v3.5.5...v3.5.6
[3.5.5]: https://github.com/woodger/pwd-fs/compare/v3.5.4...v3.5.5
[3.5.4]: https://github.com/woodger/pwd-fs/compare/v3.5.3...v3.5.4
[3.5.3]: https://github.com/woodger/pwd-fs/compare/v3.5.2...v3.5.3
[3.5.2]: https://github.com/woodger/pwd-fs/compare/v3.5.1...v3.5.2
[3.5.1]: https://github.com/woodger/pwd-fs/compare/v3.5.0...v3.5.1
[3.5.0]: https://github.com/woodger/pwd-fs/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/woodger/pwd-fs/compare/v3.3.5...v3.4.0
[3.3.5]: https://github.com/woodger/pwd-fs/compare/v3.3.4...v3.3.5
[3.3.4]: https://github.com/woodger/pwd-fs/compare/v3.3.3...v3.3.4
[3.3.3]: https://github.com/woodger/pwd-fs/compare/v3.3.1...v3.3.3
[3.3.1]: https://github.com/woodger/pwd-fs/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/woodger/pwd-fs/compare/v3.2.4...v3.3.0
[3.2.4]: https://github.com/woodger/pwd-fs/compare/v3.2.3...v3.2.4
[3.2.3]: https://github.com/woodger/pwd-fs/compare/v3.2.2...v3.2.3
[3.2.2]: https://github.com/woodger/pwd-fs/compare/v3.2.1...v3.2.2
[3.2.1]: https://github.com/woodger/pwd-fs/compare/v3.2.0...v3.2.1
[3.2.0]: https://github.com/woodger/pwd-fs/compare/v3.1.4...v3.2.0
[3.1.4]: https://github.com/woodger/pwd-fs/compare/v3.1.3...v3.1.4
[3.1.3]: https://github.com/woodger/pwd-fs/compare/v2.4.2...v3.1.3
[2.4.2]: https://github.com/woodger/pwd-fs/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/woodger/pwd-fs/compare/v2.3.0...v2.4.1
[2.3.0]: https://github.com/woodger/pwd-fs/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/woodger/pwd-fs/compare/v2.1.11...v2.2.0
[2.1.11]: https://github.com/woodger/pwd-fs/compare/v2.1.10...v2.1.11
[2.1.10]: https://github.com/woodger/pwd-fs/compare/v2.1.9...v2.1.10
[2.1.9]: https://github.com/woodger/pwd-fs/compare/v2.1.7...v2.1.9
[2.1.7]: https://github.com/woodger/pwd-fs/compare/v2.1.5...v2.1.7
[2.1.5]: https://github.com/woodger/pwd-fs/compare/v2.1.4...v2.1.5
[2.1.4]: https://github.com/woodger/pwd-fs/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/woodger/pwd-fs/compare/v2.1.1...v2.1.3
[2.1.1]: https://github.com/woodger/pwd-fs/compare/v2.0.1...v2.1.1
[2.0.1]: https://github.com/woodger/pwd-fs/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/woodger/pwd-fs/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/woodger/pwd-fs/compare/v1.2.14...v1.3.0
[1.2.14]: https://github.com/woodger/pwd-fs/compare/v1.2.13...v1.2.14
[1.2.13]: https://github.com/woodger/pwd-fs/compare/v1.2.12...v1.2.13
[1.2.12]: https://github.com/woodger/pwd-fs/compare/v1.1.11...v1.2.12
[1.1.11]: https://github.com/woodger/pwd-fs/compare/v1.1.10...v1.1.11
[1.1.10]: https://github.com/woodger/pwd-fs/compare/v1.0.9...v1.1.10
[1.0.9]: https://github.com/woodger/pwd-fs/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/woodger/pwd-fs/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/woodger/pwd-fs/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/woodger/pwd-fs/compare/v1.0.4...v1.0.6
[1.0.4]: https://github.com/woodger/pwd-fs/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/woodger/pwd-fs/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/woodger/pwd-fs/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/woodger/pwd-fs/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/woodger/pwd-fs/releases/tag/v1.0.0
