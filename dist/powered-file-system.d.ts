import fs from 'node:fs';
import { bitmask } from './bitmask';
/**
 * Public API entrypoint for the path-aware file system wrapper.
 */
export type Mode = keyof IConstants;
export type Flag = Extract<fs.OpenMode, string>;
export type Stats = fs.Stats;
export type CopyFilter = (src: string, dest: string) => boolean;
export * from './bitmask';
export interface IConstants {
    e: number;
    r: number;
    w: number;
    x: number;
}
/**
 * Path-aware wrapper around Node's file system APIs.
 *
 * All relative paths are resolved against `pwd`, which makes the instance
 * suitable for sandboxed or virtual working-directory workflows.
 */
export declare class PoweredFileSystem {
    readonly pwd: string;
    /**
     * Access mode aliases used by `test()`.
     */
    readonly constants: IConstants;
    /**
     * Exposes permission mask normalization as a static helper.
     */
    static bitmask: typeof bitmask;
    /**
     * @param pwd Base directory used to resolve all relative paths.
     */
    constructor(pwd?: string);
    /**
     * Checks whether the given path is accessible with the requested mode.
     */
    test<T extends boolean = false>(src: string, options?: {
        sync?: T;
        flag?: Mode;
    }): T extends true ? boolean : Promise<boolean>;
    /**
     * Returns `lstat` information for a path.
     */
    stat<T extends boolean = false>(src: string, options?: {
        sync?: T;
    }): T extends true ? Stats : Promise<Stats>;
    /**
     * Applies a mode recursively to a file or directory tree.
     */
    chmod<T extends boolean = false>(src: string, mode: number, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    /**
     * Applies ownership recursively to a file or directory tree.
     */
    chown<T extends boolean = false>(src: string, options?: {
        sync?: T;
        uid?: number;
        gid?: number;
    }): T extends true ? void : Promise<void>;
    /**
     * Creates a symbolic link from `dest` to `src`.
     */
    symlink<T extends boolean = false>(src: string, dest: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    /**
     * Copies `src` into the destination directory.
     */
    copy<T extends boolean = false>(src: string, dest: string, options?: {
        sync?: T;
        umask?: number;
        overwrite?: boolean;
        filter?: CopyFilter;
    }): T extends true ? void : Promise<void>;
    /**
     * Renames or moves a file system node.
     */
    rename<T extends boolean = false>(src: string, dest: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    /**
     * Removes a file system node recursively.
     */
    remove<T extends boolean = false>(src: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    /**
     * Removes all directory entries while preserving the directory itself.
     */
    emptyDir<T extends boolean = false>(src: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    /**
     * Reads a file relative to the current instance root.
     */
    read<T extends boolean = false>(src: string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
        flag?: Flag;
    }): T extends true ? string | Buffer : Promise<string | Buffer>;
    /**
     * Writes a file and applies the resulting permissions explicitly.
     */
    write<T extends boolean = false>(src: string, data: Buffer | string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
        umask?: number;
        flag?: Flag;
    }): T extends true ? void : Promise<void>;
    /**
     * @deprecated Use `write(..., { flag: 'a' })` instead.
     */
    append<T extends boolean = false>(src: string, data: Buffer | string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
        umask?: number;
    }): T extends true ? void : Promise<void>;
    /**
     * Lists directory entries relative to the current instance root.
     */
    readdir<T extends boolean = false>(dir: string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
    }): T extends true ? string[] : Promise<string[]>;
    /**
     * Resolves the target of a symbolic link.
     */
    readlink<T extends boolean = false>(src: string, options?: {
        sync?: T;
        encoding?: BufferEncoding;
    }): T extends true ? string : Promise<string>;
    /**
     * Resolves a path to its canonical absolute location.
     */
    realpath<T extends boolean = false>(src: string, options?: {
        sync?: T;
        encoding?: BufferEncoding;
    }): T extends true ? string : Promise<string>;
    /**
     * Creates a directory tree relative to the current instance root.
     */
    mkdir<T extends boolean = false>(dir: string, options?: {
        sync?: T;
        umask?: number;
    }): T extends true ? void : Promise<void>;
}
