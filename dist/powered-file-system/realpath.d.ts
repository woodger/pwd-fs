import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Resolves a path to its canonical absolute location.
 */
export declare function realpath<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    encoding?: BufferEncoding;
}): T extends true ? string : Promise<string>;
