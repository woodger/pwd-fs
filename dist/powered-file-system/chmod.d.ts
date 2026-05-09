import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Resolves the target path and delegates recursive mode updates.
 */
export declare function chmod(this: PoweredFileSystem, src: string, mode: number, options: SyncOption): void;
export declare function chmod(this: PoweredFileSystem, src: string, mode: number, options?: AsyncOption): Promise<void>;
export declare function chmod(this: PoweredFileSystem, src: string, mode: number, options?: MaybeSyncOption): void | Promise<void>;
