import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, Stats, SyncOption } from '../powered-file-system';
/**
 * Returns `lstat` data so symlinks are reported as links instead of followed targets.
 */
export declare function stat(this: PoweredFileSystem, src: string, options: SyncOption): Stats;
export declare function stat(this: PoweredFileSystem, src: string, options?: AsyncOption): Promise<Stats>;
export declare function stat(this: PoweredFileSystem, src: string, options?: MaybeSyncOption): Stats | Promise<Stats>;
