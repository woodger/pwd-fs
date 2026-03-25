import type { Flag, PoweredFileSystem } from '../powered-file-system';
/**
 * Writes a file relative to `pwd` and then reapplies the computed permissions explicitly.
 */
export declare function write<T extends boolean = false>(this: PoweredFileSystem, src: string, data: Buffer | string, options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    umask?: number;
    flag?: Flag;
}): T extends true ? void : Promise<void>;
