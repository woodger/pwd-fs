# Abstraction Policy

> Type: Policy. This document defines rules for introducing interfaces, factories, registries, helpers, adapters, and shared modules.

## Purpose

This policy protects the project from premature generalization.

A typical agent mistake is to create an interface, factory, registry, helper, or adapter before real repetition or an architectural boundary appears in the code.

## Basic Rule

An abstraction appears after repetition or an explicit boundary.

Allowed reasons:

- the logic is actually repeated;
- there are two or more implementations;
- there is an explicit boundary between business logic and infrastructure;
- the code must be tested separately;
- the inline solution has become more complex than a named abstraction;
- the new abstraction reduces coupling between existing parts.

Not allowed reasons:

- "this is architecturally prettier";
- "it may be useful later";
- "other projects do it this way";
- "a second implementation will appear someday";
- "I want to hide the details";
- "the file became visually long".

## One Implementation

One implementation usually does not require an interface.

An interface is allowed with one implementation only if:

- it is a public contract;
- it is a boundary for an infrastructure adapter;
- it is a test seam without which behavior cannot be checked reliably;
- it is an external API requirement;
- there is an owner decision for an extension point.

Creating an interface only so that a class "depends on an abstraction" is forbidden.

## Helpers

A helper is introduced only if it reduces complexity.

Allowed:

- extract a repeated non-trivial calculation;
- name a complex condition when the name exposes business meaning;
- hide an integration detail inside an infrastructure boundary;
- remove duplication that has already appeared in the current task.

Not allowed:

- wrap one standard function without a new responsibility;
- hide an important branch behind a too-generic name;
- create `utils` for one line;
- extract two similar lines when the similarity is accidental;
- create a helper that forces readers to open more files to understand simple behavior.

A good helper makes the calling code clearer. A bad helper hides meaning and increases navigation.

## Factories

A factory is needed when object creation itself has become a separate responsibility.

Allowed:

- creation logic contains branching;
- several dependencies must be assembled;
- there is lifecycle or resource ownership;
- there are several supported creation modes;
- the factory is public API.

Not allowed:

- create `createX()` only instead of `new X()`;
- extract a constructor call for consistency;
- create a factory before lifecycle/branching/dependency assembly appears.

## Registries

A registry is needed only for dynamic selection from a set of known implementations.

Allowed:

- there are several registered handlers/adapters;
- selection happens by runtime key;
- the set of entries is part of the contract;
- duplicate switch/lookup logic has already appeared.

Not allowed:

- a registry with one item;
- a registry "for the future";
- a registry instead of a simple import;
- a registry that hides the dependency graph.

## Adapters

An adapter is needed at a boundary with an external system, library, filesystem, network, framework, or process API.

Allowed:

- separate an external type from an internal/public contract;
- isolate library-specific behavior;
- normalize external errors;
- hide environment-specific IO.

Not allowed:

- create an adapter for an internal function without an external boundary;
- introduce an adapter only for naming symmetry;
- leak an adapter type into public API without an owner decision.

## Shared / Common / Utils

A shared module is allowed only when it has a clear responsibility.

Forbidden:

- create `utils`, `common`, `shared`, or `helpers` as a dumping ground;
- move code there without naming the responsibility;
- mix unrelated helpers;
- use a shared module as a bypass around an architectural boundary.

If shared code is needed, the name must describe the role:

```text
config/
filesystem/
diagnostics/
formatting/
runtime/
```

If the role cannot be named more precisely, the abstraction is not ready yet.

## Local Simplicity

Local simplicity is more important than "beautiful architecture".

Preferred:

- keep a simple condition inline;
- keep one implementation without an interface;
- keep a direct call without a factory;
- keep an explicit import without a registry;
- keep local code next to its only usage.

Architectural form is justified only when it reduces current complexity, not when it demonstrates future design.

## Frequency Rule

Practical rule:

```text
1 use  -> inline
2 uses -> consider whether this is the same responsibility
3+ uses -> consider an abstraction
```

The number of repetitions is not enough by itself. The repetition must have the same reason to change.

## Check Before Extracting

Before adding an abstraction, answer:

1. What current problem is being solved?
2. Is there repetition or an explicit boundary?
3. Will the code be easier to read at the call site?
4. Is important behavior being hidden?
5. Is a public/internal contract being created for the future?
6. Can the task be solved locally in a simpler way?

If the answers are unconvincing, the abstraction is not added.

## Examples

Allowed:

- extract repeated config parsing when it is used in several modules with the same reason to change;
- create an adapter for filesystem access when business logic must not know about IO;
- create a factory when runtime object creation requires lifecycle and several dependencies;
- create a registry when there are several handlers and runtime dispatch.

Not allowed:

- create `utils.ts` for one function;
- create an interface for a single class without a boundary;
- create a registry with one handler;
- create a factory that only calls a constructor;
- extract a helper so that the calling code loses important context.
