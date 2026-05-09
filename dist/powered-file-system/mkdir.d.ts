import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
type MkdirOptions = {
    umask?: number;
};
/**
 * Creates directories relative to the instance base path.
 */
export declare function mkdir(this: PoweredFileSystem, dir: string, options: SyncOption & MkdirOptions): void;
export declare function mkdir(this: PoweredFileSystem, dir: string, options?: AsyncOption & MkdirOptions): Promise<void>;
export declare function mkdir(this: PoweredFileSystem, dir: string, options?: MaybeSyncOption & MkdirOptions): void | Promise<void>;
export {};
