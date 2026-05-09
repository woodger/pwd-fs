import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Removes directory contents while preserving the directory itself.
 */
export declare function emptyDir(this: PoweredFileSystem, src: string, options: SyncOption): void;
export declare function emptyDir(this: PoweredFileSystem, src: string, options?: AsyncOption): Promise<void>;
export declare function emptyDir(this: PoweredFileSystem, src: string, options?: MaybeSyncOption): void | Promise<void>;
