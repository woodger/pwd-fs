import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, ReadOptions, SyncOption } from '../powered-file-system';
/**
 * Reads a file relative to `pwd` and preserves Buffer mode when `encoding` is `null`.
 */
export declare function read(this: PoweredFileSystem, src: string, options: SyncOption & ReadOptions<true, null> & {
    encoding: null;
}): Buffer;
export declare function read(this: PoweredFileSystem, src: string, options: SyncOption & ReadOptions<true, BufferEncoding>): string;
export declare function read(this: PoweredFileSystem, src: string, options: AsyncOption & ReadOptions<false, null> & {
    encoding: null;
}): Promise<Buffer>;
export declare function read(this: PoweredFileSystem, src: string, options?: AsyncOption & ReadOptions<false, BufferEncoding>): Promise<string>;
export declare function read(this: PoweredFileSystem, src: string, options?: MaybeSyncOption & ReadOptions<boolean, BufferEncoding | null>): string | Buffer | Promise<string | Buffer>;
