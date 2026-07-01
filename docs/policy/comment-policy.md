# Comment Policy

> Type: Policy. This document defines rules for writing comments in production code.

## Purpose

Comments must explain a module role, responsibility boundaries, invariants, and reasons for non-obvious decisions.

A comment must not duplicate code, retell obvious mechanics, or replace clear names for functions, types, and variables.

The main question a comment must answer is:

> Why does this decision exist in this form?

Not:

> What does this line do?

## Basic Rules

1. In each production module that participates in runtime, defines a layer contract, or contains non-trivial responsibility, one top architectural block is allowed.
2. The top architectural block must describe the file role, allowed responsibility, module boundaries, and foreign responsibility that must not be moved into this file.
3. Local comments are allowed only where the reason for a decision, invariant, or constraint would be lost without them.
4. Obvious code actions do not need comments.
5. JSDoc for public contracts must be short and specific.
6. Within one file, comment style and language must be consistent.
7. A comment must explain "why" or "for what purpose", not retell "what the line does".
8. A comment must not expand the code contract. If a comment mentions a guarantee, invariant, execution order, safety, or constraint, it must be backed by code, types, or tests.
9. Refactoring history must not be stored in comments. Git, ADRs, and design notes exist for that.

## Top Architectural Block

The top block describes the whole module, not individual functions.

Template:

```ts
/**
 * Module <role of the file in the system>.
 *
 * Allowed here:
 * - <responsibility 1>;
 * - <responsibility 2>;
 * - <responsibility 3>;
 *
 * This file must not contain <foreign responsibility>.
 */
```

Good example:

```ts
/**
 * The runtime config resolver module transforms external input
 * into normalized launch settings.
 *
 * Allowed here:
 * - reading supported config sources;
 * - validating required fields;
 * - forming diagnostics for invalid config;
 *
 * This file must not contain CLI rendering or network calls.
 */
```

Bad example:

```ts
/**
 * Config file.
 */
```

This comment does not explain the module role, boundaries, or allowed responsibility.

## Exceptions

A top architectural block is not required for:

- barrel export files;
- build output;
- test fixtures;
- trivial files with one obvious type or constant;
- temporary local helper files that do not define a production contract.

If a file participates in production runtime, defines a layer contract, or contains non-trivial responsibility, a top block is allowed and must be meaningful.

## Public Contract JSDoc

JSDoc for public functions, classes, and interfaces must describe only contract-level details:

- input constraints;
- side effects;
- errors;
- lifecycle;
- important guarantees;
- external API constraints.

JSDoc is not needed if the meaning is fully clear from the name, types, and code.

Bad:

```ts
/**
 * Creates a client.
 */
createClient(options);
```

Better:

```ts
/**
 * Creates a runtime client from already validated options.
 *
 * The function does not read environment and does not change global state.
 */
createClient(options);
```

But if this is already obvious from the interface and tests, it is better not to add the comment.

## When A Comment Is Needed

A comment is needed if it explains:

- module role;
- layer boundary;
- non-obvious invariant;
- workaround;
- external API constraint;
- reason for an unusual branch;
- reason for cleanup logic;
- preservation of compatibility with an old contract;
- an intentionally empty branch when absence of action is part of the logic;
- placeholder / TODO with an explanation of why implementation is absent for now;
- reason why a dependency is allowed exactly here.

Good:

```ts
// CLI config has priority over file config:
// this is an observable command contract, not a merge order detail.
const options = mergeConfig(fileConfig, cliConfig);
```

Good:

```ts
// The first request is not delayed:
// the rate limit constrains the interval between subsequent calls.
if (lastRequestTime === undefined) {
  lastRequestTime = now;
  return;
}
```

## When A Comment Is Not Needed

A comment is not needed if:

- the meaning is already clear from the function name, type, and code;
- the comment repeats the line literally;
- the comment describes trivial mechanics;
- the comment explains language syntax;
- the comment becomes outdated faster than the code itself;
- the comment stores change history instead of the current reason for the decision.

Bad:

```ts
// Create options
const options = resolveOptions(input);
```

Bad:

```ts
// Check if path exists
if (fs.existsSync(file)) {
  return file;
}
```

## TODO And Placeholder

A TODO is allowed only if it explains:

- why implementation is deferred;
- which constraint is currently in effect;
- under which condition this place must be revisited.

Good:

```ts
// TODO: streaming mode requires an owner decision on public API shape.
// Revisit after supported options are approved.
```

Bad:

```ts
// TODO: fix later
```

If a module or branch is intentionally empty, this must be stated explicitly.

## Workaround Comments

A workaround must explain the external constraint, not just describe the workaround.

Good:

```ts
// External API returns an empty string instead of a missing value:
// normalize it here so the domain layer works only with undefined.
const value = rawValue === '' ? undefined : rawValue;
```

Bad:

```ts
// Normalize value
const value = rawValue === '' ? undefined : rawValue;
```

## Comments And Architectural Boundaries

A comment is useful when it protects a layer boundary.

Good:

```ts
/**
 * CLI entrypoint only transforms argv into command input.
 *
 * This file must not contain domain behavior, persistence, or network orchestration.
 */
```

This block helps avoid mixing bootstrap and runtime behavior.

## Good Comment Criterion

A good comment helps understand:

- why the module exists;
- where its boundaries are;
- which invariant must not be violated;
- which external constraint affected the code;
- why an obviously strange decision is actually intentional.

If a comment can be deleted without losing meaning, it should be deleted.
