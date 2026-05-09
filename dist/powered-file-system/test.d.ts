import type { AsyncOption, MaybeSyncOption, Mode, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Thin wrapper around `fs.access` that resolves paths against the instance base path.
 */
export declare function test(this: PoweredFileSystem, src: string, options: SyncOption & {
    flag?: Mode;
}): boolean;
export declare function test(this: PoweredFileSystem, src: string, options?: AsyncOption & {
    flag?: Mode;
}): Promise<boolean>;
export declare function test(this: PoweredFileSystem, src: string, options?: MaybeSyncOption & {
    flag?: Mode;
}): boolean | Promise<boolean>;
