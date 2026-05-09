import type { AsyncOption, CopyFilter, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
type CopyOptions = {
    umask?: number;
    overwrite?: boolean;
    filter?: CopyFilter;
};
/**
 * Resolves source and destination paths before delegating recursive copy work.
 */
export declare function copy(this: PoweredFileSystem, src: string, dest: string, options: SyncOption & CopyOptions): void;
export declare function copy(this: PoweredFileSystem, src: string, dest: string, options?: AsyncOption & CopyOptions): Promise<void>;
export declare function copy(this: PoweredFileSystem, src: string, dest: string, options?: MaybeSyncOption & CopyOptions): void | Promise<void>;
export {};
