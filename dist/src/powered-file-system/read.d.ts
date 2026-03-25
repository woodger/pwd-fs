import type { Flag, PoweredFileSystem } from '../powered-file-system';
export declare function read<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    flag?: Flag;
}): T extends true ? string | Buffer : Promise<string | Buffer>;
