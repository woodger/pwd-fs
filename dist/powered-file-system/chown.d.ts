import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Resolves the target path and applies recursive ownership changes where supported.
 */
type ChownOptions = {
    uid?: number;
    gid?: number;
};
export declare function chown(this: PoweredFileSystem, src: string, options: SyncOption & ChownOptions): void;
export declare function chown(this: PoweredFileSystem, src: string, options?: AsyncOption & ChownOptions): Promise<void>;
export declare function chown(this: PoweredFileSystem, src: string, options?: MaybeSyncOption & ChownOptions): void | Promise<void>;
export {};
