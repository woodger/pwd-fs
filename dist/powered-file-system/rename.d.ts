import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Resolves both paths against the instance base path before delegating to Node's rename API.
 */
export declare function rename(this: PoweredFileSystem, src: string, dest: string, options: SyncOption): void;
export declare function rename(this: PoweredFileSystem, src: string, dest: string, options?: AsyncOption): Promise<void>;
export declare function rename(this: PoweredFileSystem, src: string, dest: string, options?: MaybeSyncOption): void | Promise<void>;
