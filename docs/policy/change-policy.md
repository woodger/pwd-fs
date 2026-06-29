# Change Policy

> Type: Policy. This document defines the minimum acceptable change rule.

## Minimality Of Changes

A change must be the minimum necessary change required to solve the task.

Forbidden:

- large refactoring without a request
- cleanup without justification
- style changes outside the affected area
- architecture changes
- pipeline changes
- scripts changes
- behavior changes

Existing code is considered intentional.

If a change is not required, it must not be made.

## Local Improvements

Small improvements are allowed when they are directly related to the current task.

Allowed:

- remove local duplication
- improve naming
- simplify readability
- fix a nearby obvious defect
- improve local tests

Conditions:

- behavior does not change
- the change remains local
- the improvement helps solve the current task

If an improvement is outside the task scope, it should be proposed separately.

## Examples

Allowed:

- fix a specific defect in one module without rewriting neighboring code
- add a focused test for a new requirement without changing the existing test pipeline
- extend an existing `if` branch when this is directly required by the task

Not allowed:

- mass-rename entities for consistency
- perform unrelated renames in other modules
- rewrite an entire module instead of fixing one branch
- change file structure only because it seems more convenient

## Module Boundaries

Bad structure should not be preserved only because it already exists.

Allowed:

- fix poor local naming
- clarify a module responsibility
- move a small amount of code to improve readability

Not allowed:

- redesign a subsystem
- move files in bulk
- change architectural boundaries without a request

## Good Practices

- before making a change, state which exact task requirement the change covers
- limit the diff to files that actually participate in the task
- check whether the change affects behavior outside the required scenario

## Environment Issues

Environment issues are not a reason to change project code.

If validation cannot run because of missing tools, permissions, cache, shell utilities, or container limitations, stop, describe the problem, and ask for a decision.

Using a local temporary cache/workdir is allowed only if it does not change the project and does not expand the task scope.
