# Scripts And Build Policy

> Type: Policy. This document defines restrictions on changing scripts, build, and test pipeline.

## Purpose

Build, test, and run scripts are considered part of the runtime pipeline.

They must not be changed without clear necessity.

## Forbidden Changes

Forbidden without a direct requirement:

- add file deletion;
- add automatic build output cleanup;
- add a `clean` script for automatic cleanup before `build` or `test`;
- add shell-specific cleanup commands;
- add prebuild/postbuild hooks;
- add pretest/posttest hooks;
- change command order;
- add chained commands for convenience;
- replace portable runtime logic with shell commands.

Example of a correct minimal script:

```json
"build": "<project-build-command>"
```

Example of an incorrect change:

```json
"build": "rm -rf <build-output> && <project-build-command>"
```

If stale artifacts remain in build output after files are moved, they must be removed narrowly and explicitly as part of that specific operation, not by changing the project's permanent build/test pipeline.

File deletion is allowed only when the task explicitly requests it.

## Additional Examples

Allowed:

- leave the existing `build` unchanged and fix the cause of the error in code;
- add a new script only when the task directly requires a new entrypoint;
- change the implementation of the invoked file without changing the run scenario itself, if the task is about that file's behavior.

Not allowed:

- change the test script so that it runs additional unrelated checks;
- replace the existing build tool with another one without a direct task requirement;
- add cleanup of temporary directories "just in case";
- add automatic build output cleanup before `build` or `test`.

## Good Practices

- treat scripts as part of the project contract, not as an implementation detail;
- if the problem can be solved inside the code, do not move the solution into shell commands;
- before changing a script, check whether step order, side effects, and entrypoints change.
