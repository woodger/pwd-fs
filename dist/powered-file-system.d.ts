import fs from 'node:fs';
import { bitmask } from './bitmask';
/**
 * Public API entrypoint for the path-aware file system wrapper.
 */
export type Mode = keyof IConstants;
export type Flag = Extract<fs.OpenMode, string>;
export type Stats = fs.Stats;
export type CopyFilter = (src: string, dest: string) => boolean;
export type SyncResult<T extends boolean, TResult> = T extends true ? TResult : Promise<TResult>;
export type SyncOption = {
    sync: true;
};
export type AsyncOption = {
    sync?: false;
};
export type MaybeSyncOption = {
    sync?: boolean;
};
export type ReadResult<TEncoding> = TEncoding extends null ? Buffer : string;
export type ReaddirResult<TEncoding> = TEncoding extends null ? Buffer[] : string[];
export type ReadOptions<TSync extends boolean = boolean, TEncoding extends BufferEncoding | null = BufferEncoding> = {
    sync?: TSync;
    encoding?: TEncoding;
    flag?: Flag;
};
export type ReaddirOptions<TSync extends boolean = boolean, TEncoding extends BufferEncoding | null = BufferEncoding> = {
    sync?: TSync;
    encoding?: TEncoding;
};
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
 * Relative paths are resolved against `pwd`; absolute paths are preserved.
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
     * Resolves relative paths against `pwd` while preserving absolute paths.
     */
    resolve(src: string): string;
    /**
     * Checks whether the given path is accessible with the requested mode.
     */
    test(src: string, options: SyncOption & {
        flag?: Mode;
    }): boolean;
    test(src: string, options?: AsyncOption & {
        flag?: Mode;
    }): Promise<boolean>;
    /**
     * Returns `lstat` information for a path.
     */
    stat(src: string, options: SyncOption): Stats;
    stat(src: string, options?: AsyncOption): Promise<Stats>;
    /**
     * Applies a mode recursively to a file or directory tree.
     */
    chmod(src: string, mode: number, options: SyncOption): void;
    chmod(src: string, mode: number, options?: AsyncOption): Promise<void>;
    /**
     * Applies ownership recursively to a file or directory tree.
     */
    chown(src: string, options: SyncOption & {
        uid?: number;
        gid?: number;
    }): void;
    chown(src: string, options?: AsyncOption & {
        uid?: number;
        gid?: number;
    }): Promise<void>;
    /**
     * Creates a symbolic link from `dest` to `src`.
     */
    symlink(src: string, dest: string, options: SyncOption): void;
    symlink(src: string, dest: string, options?: AsyncOption): Promise<void>;
    /**
     * Copies `src` into the destination directory.
     */
    copy(src: string, dest: string, options: SyncOption & {
        umask?: number;
        overwrite?: boolean;
        filter?: CopyFilter;
    }): void;
    copy(src: string, dest: string, options?: AsyncOption & {
        umask?: number;
        overwrite?: boolean;
        filter?: CopyFilter;
    }): Promise<void>;
    /**
     * Renames or moves a file system node.
     */
    rename(src: string, dest: string, options: SyncOption): void;
    rename(src: string, dest: string, options?: AsyncOption): Promise<void>;
    /**
     * Removes a file system node recursively.
     */
    remove(src: string, options: SyncOption): void;
    remove(src: string, options?: AsyncOption): Promise<void>;
    /**
     * Removes all directory entries while preserving the directory itself.
     */
    emptyDir(src: string, options: SyncOption): void;
    emptyDir(src: string, options?: AsyncOption): Promise<void>;
    /**
     * Reads a file relative to the current instance path.
     */
    read(src: string, options: SyncOption & ReadOptions<true, null> & {
        encoding: null;
    }): Buffer;
    read(src: string, options: SyncOption & ReadOptions<true, BufferEncoding>): string;
    read(src: string, options: AsyncOption & ReadOptions<false, null> & {
        encoding: null;
    }): Promise<Buffer>;
    read(src: string, options?: AsyncOption & ReadOptions<false, BufferEncoding>): Promise<string>;
    /**
     * Writes a file and applies the resulting permissions explicitly.
     */
    write(src: string, data: Buffer | string, options: SyncOption & {
        encoding?: BufferEncoding | null;
        umask?: number;
        flag?: Flag;
    }): void;
    write(src: string, data: Buffer | string, options?: AsyncOption & {
        encoding?: BufferEncoding | null;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    /**
     * @deprecated Use `write(..., { flag: 'a' })` instead.
     */
    append(src: string, data: Buffer | string, options: SyncOption & {
        encoding?: BufferEncoding | null;
        umask?: number;
    }): void;
    append(src: string, data: Buffer | string, options?: AsyncOption & {
        encoding?: BufferEncoding | null;
        umask?: number;
    }): Promise<void>;
    /**
     * Lists directory entries relative to the current instance path.
     */
    readdir(dir: string, options: SyncOption & ReaddirOptions<true, null> & {
        encoding: null;
    }): Buffer[];
    readdir(dir: string, options: SyncOption & ReaddirOptions<true, BufferEncoding>): string[];
    readdir(dir: string, options: AsyncOption & ReaddirOptions<false, null> & {
        encoding: null;
    }): Promise<Buffer[]>;
    readdir(dir: string, options?: AsyncOption & ReaddirOptions<false, BufferEncoding>): Promise<string[]>;
    /**
     * Resolves the target of a symbolic link.
     */
    readlink(src: string, options: SyncOption & {
        encoding?: BufferEncoding;
    }): string;
    readlink(src: string, options?: AsyncOption & {
        encoding?: BufferEncoding;
    }): Promise<string>;
    /**
     * Resolves a path to its canonical absolute location.
     */
    realpath(src: string, options: SyncOption & {
        encoding?: BufferEncoding;
    }): string;
    realpath(src: string, options?: AsyncOption & {
        encoding?: BufferEncoding;
    }): Promise<string>;
    /**
     * Creates a directory tree relative to the current instance path.
     */
    mkdir(dir: string, options: SyncOption & {
        umask?: number;
    }): void;
    mkdir(dir: string, options?: AsyncOption & {
        umask?: number;
    }): Promise<void>;
}
