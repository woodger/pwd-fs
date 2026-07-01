# Decision Rule

> Type: Policy. This document defines the baseline filter before any code change.

If the change is not required, do not make it.

If the change adds behavior, do not make it.

If the change removes behavior, do not make it.

If the change is made because "this is how it is usually done", do not make it.

If the change seems safe, do not make it.

If the change seems correct, do not make it.

If there is doubt, leave the code as it is.

Existing code is considered intentional.

## Practical Application

Before making a change, check the following in order:

1. Is the change directly required by the task?
2. Does it change behavior, pipeline, or project structure?
3. Can the task be solved with a smaller change?
4. Is the decision based on a heuristic instead of a requirement?

## Examples

Correct decision:

- fix a specific conditional branch when the task is about an incorrect calculation
- add a test for already required behavior

Incorrect decision:

- rewrite a module "while we are touching it"
- add artifact cleanup because it feels customary
- change the dependency graph for a subjective sense of order
