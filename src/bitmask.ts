export function bitmask(mode: number): number {
  if (typeof mode !== 'number') {
    throw new TypeError(`Expected 'number', got '${typeof mode}'`);
  }

  const permissions: number[] = [
    0o400, 0o200, 0o100, 0o040, 0o020, 0o010, 0o004, 0o002, 0o001
  ];

  return permissions.reduce((umask, flag) => {
    return (mode & flag) ? umask + flag : umask;
  }, 0);
}
