# Testing Policy

> Type: Policy. This document limits the addition of tests and test infrastructure.

## Purpose

Tests must protect production contracts, observable behavior, and boundary scenarios.

A test must not lock in accidental implementation, temporary code structure, or internal action order unless this is part of the public contract.

The main question a test must answer is:

> Which behavior or production risk is protected?

Not:

> Which lines of code were executed?

## How To Run Tests

Tests are written in TypeScript in `src/**/*.test.ts` and use standard Node.js modules:

- `node:test`;
- `node:assert`.

`yarn test` compiles the project, uses `fwa` to discover compiled tests in `dist/`, and then delegates execution to Node's native test runner.

For full validation after changes in `src`, run:

```bash
yarn build
yarn test
```

## Test Requirements

Tests must be:

- isolated;
- deterministic;
- readable;
- minimal but sufficient;
- focused on one behavior;
- oriented toward observable result, not internal implementation.

One test must verify one behavior.

Multiple assertions in one test are allowed if they describe the same contract. If assertions verify different reasons for behavior changes, they must be split into separate tests.

## Test File Boundary

A test file must cover a specific production file, not a directory.

Mapping rule:

```text
src/bootstrap/help/renderer.ts      -> src/bootstrap/help/renderer.test.ts
src/bootstrap/help/commands.ts      -> src/bootstrap/help/commands.test.ts
src/bootstrap/help/help.ts          -> src/bootstrap/help/help.test.ts
src/bootstrap/cli.ts                -> src/bootstrap/cli.test.ts
src/bootstrap/config.ts             -> src/bootstrap/config.test.ts
```

Creating a test whose name looks like a test for a directory or barrel module is forbidden:

```text
src/bootstrap/help.test.ts          # covers the help/ directory
src/bootstrap/help/index.test.ts    # covers a barrel-only index.ts
```

An exception is allowed only if the file is actually a runtime entrypoint
or a package entrypoint with its own behavior. In that case, the test must
verify the entrypoint behavior itself, not the internal files of the directory.

If `index.ts` contains only re-exports, a separate test for it is not needed.
Files that contain logic must be tested.

## Imports In Tests

Unit tests must import code from the specific file they verify.

Allowed:

```ts
import { renderCliHelp } from './renderer';
import { isHelpRequested } from './help'; // if there is a nearby help.ts file
```

Forbidden for a unit test of a specific file:

```ts
import { renderCliHelp } from './index';
import { renderCliHelp } from '../help';
```

The second example is forbidden if `../help` resolves to a directory or barrel,
not to a specific file.

An integration test may go through a public entrypoint if it verifies
observable entrypoint behavior: exit code, stdout/stderr, dispatch, wiring, or
public API contract.

## Isolation

A test must minimize dependence on:

- the real filesystem, unless filesystem behavior is being tested;
- network;
- current time;
- test execution order;
- external processes;
- global mutable state;
- stale build artifacts.

If dependence on an external resource is the essence of the test, it must be clearly visible from the test name, suite, or fixture.

## Test Data

Test data must be minimal but sufficient for the scenario.

There is no need to create a realistic dataset if one object with three fields is enough for the check.

Good:

```ts
test('returns undefined for an unknown path', () => {
  const throttle = new Throttle({
    KnownService: 100
  });

  assert.equal(
    throttle.resolveLimit('/api.contract.v1.UnknownService/Get'),
    undefined
  );
});
```

Bad:

```ts
test('validates throttling', () => {
  const throttle = new Throttle({
    ExamplesService: 200,
    DataService: 300,
    OperationsService: 200,
    SandboxService: 200,
    UsersService: 100
  });

  assert.equal(
    throttle.resolveLimit('/api.contract.v1.UnknownService/Get'),
    undefined
  );
});
```

Extra fields hide the reason for the test and increase maintenance cost.

## Test Suite Naming

Test names must describe the public API path and expected behavior.

Top-level `describe()` names the unit under test:

- `ClassName` for classes and runtime components;
- `functionName` for standalone exported functions;
- `objectName` for exported objects or namespaces;
- `module-name` only when several closely related exports are tested and there is no single primary subject.

Good:

```ts
describe('Throttle', () => {
  // ...
});

describe('createSdkMetadata', () => {
  // ...
});

describe('suite runner helpers', () => {
  // ...
});
```

Bad:

```ts
describe('utils', () => {
  // ...
});

describe('tests for sdk', () => {
  // ...
});
```

## Nested Suite Naming

Nested `describe()` names a public member or operation:

- `constructor` for constructor behavior;
- `#methodName` for instance methods called as `instance.methodName()`;
- `.methodName` for static methods called as `ClassName.methodName()`;
- `.methodName` for exported object/namespace methods called as `objectName.methodName()`;
- `functionName` for standalone functions grouped under a module-level suite.

Examples:

```ts
describe('Throttle', () => {
  describe('#resolveLimit', () => {
    // ...
  });

  describe('#reduce', () => {
    // ...
  });
});

describe('suite runner helpers', () => {
  describe('collectTestFiles', () => {
    // ...
  });
});
```

A parent suite must not contain sibling `describe()` blocks with the same name. If two blocks have the same name, they must be merged or named after different public scenarios.

## Test Case Naming

`test()` names only expected behavior.

The test name must not repeat the subject or method name if they are already stated in `describe()`.

Good:

```ts
describe('Throttle', () => {
  describe('#resolveLimit', () => {
    test('returns undefined for an unknown path', () => {
      // ...
    });
  });
});
```

Bad:

```ts
describe('Throttle', () => {
  describe('#resolveLimit', () => {
    test('Throttle resolveLimit returns undefined for an unknown path', () => {
      // ...
    });
  });
});
```

Repeating the subject makes the name noisy and worsens test output readability.

## Preferred Behavior Verbs

Preferred verbs for `test()`:

- `returns ...`;
- `throws ...`;
- `rejects ...`;
- `parses ...`;
- `formats ...`;
- `writes ...`;
- `reads ...`;
- `keeps ...`;
- `skips ...`;
- `uses ...`;
- `does not ...`;
- `handles ...`;
- `preserves ...`;
- `computes ...`;
- `maps ...`;
- `normalizes ...`;
- `ignores ...`.

Good:

```ts
test('throws for unknown unary limit path', async () => {
  // ...
});

test('does not throttle response streams', async () => {
  // ...
});
```

Bad:

```ts
test('works correctly', () => {
  // ...
});

test('should process data', () => {
  // ...
});
```

`should` is not technically forbidden, but the preferred style is a direct description of observable behavior without an extra modal word.

## Explicitness Over DRY

The drive toward DRY does not apply to tests.

Repetition in tests is allowed if it:

* keeps the scenario local;
* removes non-obvious setup;
* reduces the risk of mistakes in test infrastructure;
* allows the test case to be read without jumping to helpers.

A bad test is worse than no test: it creates false confidence and makes code harder to change.

## Generalization In Tests

Helpers in tests are almost always undesirable.

A helper is allowed only if it removes technical noise and does not hide the meaning of the scenario.
If a helper is more complex than the test itself, it must be removed.
If a large helper, fixture builder, or conditional test logic is needed for a check, this may signal that production code is poorly separated or that the test is at the wrong level.
A direct test with explicit data is preferable to abstract test infrastructure.

## Coverage Boundaries

There is no need to try to cover the entire public method or contract with one large test.
If composite behavior sections are already checked separately, an additional large test appears unnecessary.
It is allowed to leave some sections without direct coverage if they are already indirectly protected by other tests.
