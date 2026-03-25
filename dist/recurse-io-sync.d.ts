/**
 * Synchronous counterpart of the recursive chmod implementation.
 */
export declare function chmodSync(src: string, mode: number): void;
/**
 * Synchronous counterpart of the recursive chown implementation.
 */
export declare function chownSync(src: string, uid: number, gid: number): void;
/**
 * Synchronously copies a file system node into the target directory.
 */
export declare function copySync(src: string, dir: string, umask: number): void;
/**
 * Synchronously removes files, directories, and symlinks without following links.
 */
export declare function removeSync(src: string): void;
/**
 * Synchronously creates a directory tree using permissions derived from umask.
 */
export declare function mkdirSync(dir: string, umask: number): void;
