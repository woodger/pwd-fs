import type { PoweredFileSystem } from '../powered-file-system';
export declare function readdir<T extends boolean = false>(this: PoweredFileSystem, dir: string, options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
}): T extends true ? string[] : Promise<string[]>;
