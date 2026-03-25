import { NoParamCallback } from 'node:fs';
export interface ICopyOptions {
    umask: number;
    overwrite: boolean;
    filter?: (src: string, dest: string) => boolean;
}
/**
 * Applies chmod depth-first so directories are updated after their contents.
 */
export declare function chmod(src: string, mode: number, callback: NoParamCallback): void;
/**
 * Applies ownership recursively while preserving current values when uid/gid are omitted.
 */
export declare function chown(src: string, uid: number, gid: number, callback: NoParamCallback): void;
/**
 * Copies a file system node into the target directory, creating directories as needed.
 */
export declare function copy(src: string, dir: string, options: ICopyOptions, callback: NoParamCallback): void;
/**
 * Removes files, directories, and symlinks without following symbolic links.
 */
export declare function remove(src: string, callback: NoParamCallback): void;
/**
 * Removes all entries inside a directory while preserving the directory itself.
 */
export declare function emptyDir(src: string, callback: NoParamCallback): void;
/**
 * Creates a directory tree with the permissions derived from the provided umask.
 */
export declare function mkdir(dir: string, umask: number, callback: NoParamCallback): void;
