import type { AsyncOption, Flag, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
type WriteOptions = {
    encoding?: BufferEncoding | null;
    umask?: number;
    flag?: Flag;
};
/**
 * Writes a file relative to `pwd` and then reapplies the computed permissions explicitly.
 */
export declare function write(this: PoweredFileSystem, src: string, data: Buffer | string, options: SyncOption & WriteOptions): void;
export declare function write(this: PoweredFileSystem, src: string, data: Buffer | string, options?: AsyncOption & WriteOptions): Promise<void>;
export declare function write(this: PoweredFileSystem, src: string, data: Buffer | string, options?: MaybeSyncOption & WriteOptions): void | Promise<void>;
export {};
