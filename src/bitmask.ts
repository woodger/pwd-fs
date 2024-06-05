export function bitmask(mode: number) {
  const type = typeof mode;

  if (type !== 'number') {
    throw new Error(
      `Argument of type '${type}' is not assignable to parameter of type 'number'.`
    );
  }

  const permissions: number[] = [ 0o400, 0o200, 0o100, 0o040, 0o020, 0o010, 0o004, 0o002, 0o001 ];
  let umask = 0o000;

  for (const flag of permissions) {
    if (mode & flag) {
      umask += flag;
    }
  }

  return umask;
}