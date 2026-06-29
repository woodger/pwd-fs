# Dependencies Policy

> Type: Policy. This document defines criteria for choosing new libraries and signs of undesirable dependencies.

Only high-quality libraries are allowed.

A library must:

- solve a broad problem
- have a clear API
- be maintained
- provide architectural value
- be justified long term

Undesirable dependencies:

- a package for one function
- a package for deleting files
- a package for a small utility
- a package wrapper over a standard function

Bad example:

rimraf

Good example:

a general-purpose filesystem library
with a complete API

## Selection Examples

Allowed:

- add a library that covers a stable infrastructure task and is already needed in several places
- choose a dependency with a clear support model and understandable documentation
- prefer the standard library if it covers the task without architectural losses

Not allowed:

- add a package only for one call that would take a few lines of project code
- pull in a dependency for "prettier" syntax
- add a library if it duplicates a tool already used in the project

## Good Practices

- before adding a dependency, state which long-term task it solves
- check whether the task can be covered by existing project libraries
- evaluate not only API convenience but also the maintenance cost of the dependency
