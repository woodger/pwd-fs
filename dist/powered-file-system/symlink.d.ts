import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
export declare function symlink(this: PoweredFileSystem, src: string, dest: string, options: SyncOption): void;
export declare function symlink(this: PoweredFileSystem, src: string, dest: string, options?: AsyncOption): Promise<void>;
export declare function symlink(this: PoweredFileSystem, src: string, dest: string, options?: MaybeSyncOption): void | Promise<void>;
