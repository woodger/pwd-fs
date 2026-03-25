import type { Flag, PoweredFileSystem } from '../powered-file-system';
/**
 * Reads a file relative to `pwd` and preserves Buffer mode when `encoding` is `null`.
 */
export declare function read<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    flag?: Flag;
}): T extends true ? string | Buffer : Promise<string | Buffer>;
