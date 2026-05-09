import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Removes a path relative to the instance base path.
 */
export declare function remove(this: PoweredFileSystem, src: string, options: SyncOption): void;
export declare function remove(this: PoweredFileSystem, src: string, options?: AsyncOption): Promise<void>;
export declare function remove(this: PoweredFileSystem, src: string, options?: MaybeSyncOption): void | Promise<void>;
