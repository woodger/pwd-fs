import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, ReaddirOptions, SyncOption } from '../powered-file-system';
/**
 * Lists directory entries relative to the instance base path.
 */
export declare function readdir(this: PoweredFileSystem, dir: string, options: SyncOption & ReaddirOptions<true, null> & {
    encoding: null;
}): Buffer[];
export declare function readdir(this: PoweredFileSystem, dir: string, options: SyncOption & ReaddirOptions<true, BufferEncoding>): string[];
export declare function readdir(this: PoweredFileSystem, dir: string, options: AsyncOption & ReaddirOptions<false, null> & {
    encoding: null;
}): Promise<Buffer[]>;
export declare function readdir(this: PoweredFileSystem, dir: string, options?: AsyncOption & ReaddirOptions<false, BufferEncoding>): Promise<string[]>;
export declare function readdir(this: PoweredFileSystem, dir: string, options?: MaybeSyncOption & ReaddirOptions<boolean, BufferEncoding | null>): string[] | Buffer[] | Promise<string[] | Buffer[]>;
