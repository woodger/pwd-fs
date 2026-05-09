import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Reads the target path stored in a symbolic link.
 */
export declare function readlink(this: PoweredFileSystem, src: string, options: SyncOption & {
    encoding?: BufferEncoding;
}): string;
export declare function readlink(this: PoweredFileSystem, src: string, options?: AsyncOption & {
    encoding?: BufferEncoding;
}): Promise<string>;
export declare function readlink(this: PoweredFileSystem, src: string, options?: MaybeSyncOption & {
    encoding?: BufferEncoding;
}): string | Promise<string>;
