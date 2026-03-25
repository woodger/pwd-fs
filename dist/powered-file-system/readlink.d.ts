import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Reads the target path stored in a symbolic link.
 */
export declare function readlink<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    encoding?: BufferEncoding;
}): T extends true ? string : Promise<string>;
