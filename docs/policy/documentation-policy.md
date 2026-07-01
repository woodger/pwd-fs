# Documentation Policy

> Type: Policy. This document defines rules for choosing the documentation source of truth and forbids duplicating code contracts in permanent reference pages.

## Purpose

Documentation must help find the current contract, not create a second source of truth next to the code.

If a contract is already expressed by a runtime mechanism, source file, config file, or tests, a Markdown document must link to that source and explain the working route instead of copying the full reference.

## README And Docs

README must remain a concise entry point to the project:

- installation;
- quick start;
- main links;
- important workflows.

Detailed rules and policies must live in `docs/`.

Navigation documents must help find the source of truth, not become a second README.

## Minimum Rule

Markdown must answer the question "where is the current contract and how should it
be used". The contract itself must live where it is verified by runtime or tests.
