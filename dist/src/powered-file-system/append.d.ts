import type { PoweredFileSystem } from '../powered-file-system';
export declare function append<T extends boolean = false>(this: PoweredFileSystem, src: string, data: Buffer | string, options?: {
    sync?: T;
    encoding?: BufferEncoding | null;
    umask?: number;
}): T extends true ? void : Promise<void>;
