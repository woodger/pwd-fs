# Non-Functional Requirements

> Type: Policy. This document defines the non-functional properties of the project that a working change must not violate.

Changes must not break:

- build reproducibility
- determinism
- portability
- CI
- runtime behavior
- file structure
- startup order
- architecture
- dependencies

Even if the code works,
a change is forbidden if it violates these properties.

## Risk Examples

- the build passes locally but depends on file ordering in a specific OS
- the code works but changes the location of output artifacts
- the change does not break logic but adds a dependency on shell-specific behavior
- tests pass but the component startup order becomes different

## Good Practices

- verify not only result correctness but also preservation of previous side effects
- avoid changes that bind the project to a specific execution environment
- separately evaluate the impact of a change on CI, file structure, and reproducibility
