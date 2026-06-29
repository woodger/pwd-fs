# Project Policies

> Type: Navigation. This document provides navigation for the policy section and defines the general purpose of the project change constraints.

This section contains project rules for changing Node.js/TypeScript codebases.

The policy set is intended to preserve:

- predictable project behavior;
- reproducible builds;
- public contract stability;
- absence of accidental changes;
- controlled code evolution.

These policies are mandatory for developers, reviewers, and agents making changes in the repository.

## Start Here

- [Decision Rule](./decision-rule-policy.md) - the meta-policy for choosing between acceptable options.
- [Change Policy](./change-policy.md) - the rule for the minimum sufficient change.

## When To Read This Section

- before starting code changes;
- during code review;
- when there is doubt whether a change is acceptable;
- when a change affects scripts, documentation, dependencies, or architecture;
- when public API, CLI behavior, build pipeline, or publish output changes.

## Full List

- [Decision Rule](./decision-rule-policy.md)
- [Change Policy](./change-policy.md)
- [Non-Functional Requirements](./non-functional-requirements.md)
- [Abstraction Policy](./abstraction-policy.md)
- [Naming Policy](./naming-policy.md)
- [Comment Policy](./comment-policy.md)
- [Testing Policy](./testing-policy.md)
- [Scripts and Build Policy](./scripts-and-build-policy.md)
- [Dependencies Policy](./dependencies-policy.md)
- [Documentation Policy](./documentation-policy.md)

## Short Route

When a change decision must be made quickly, it is enough to go through three documents:

1. [Decision Rule](./decision-rule-policy.md)
2. [Change Policy](./change-policy.md)
3. [Non-Functional Requirements](./non-functional-requirements.md)
