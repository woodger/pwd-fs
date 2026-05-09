import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
type AppendOptions = {
    encoding?: BufferEncoding | null;
    umask?: number;
};
/**
 * Backward-compatible append wrapper implemented on top of `write()`.
 */
export declare function append(this: PoweredFileSystem, src: string, data: Buffer | string, options: SyncOption & AppendOptions): void;
export declare function append(this: PoweredFileSystem, src: string, data: Buffer | string, options?: AsyncOption & AppendOptions): Promise<void>;
export declare function append(this: PoweredFileSystem, src: string, data: Buffer | string, options?: MaybeSyncOption & AppendOptions): void | Promise<void>;
export {};
