import type { AsyncOption, MaybeSyncOption, PoweredFileSystem, SyncOption } from '../powered-file-system';
/**
 * Resolves a path to its canonical absolute location.
 */
export declare function realpath(this: PoweredFileSystem, src: string, options: SyncOption & {
    encoding?: BufferEncoding;
}): string;
export declare function realpath(this: PoweredFileSystem, src: string, options?: AsyncOption & {
    encoding?: BufferEncoding;
}): Promise<string>;
export declare function realpath(this: PoweredFileSystem, src: string, options?: MaybeSyncOption & {
    encoding?: BufferEncoding;
}): string | Promise<string>;
