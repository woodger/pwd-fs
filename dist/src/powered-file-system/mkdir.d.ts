import type { PoweredFileSystem } from '../powered-file-system';
export declare function mkdir<T extends boolean = false>(this: PoweredFileSystem, dir: string, options?: {
    sync?: T;
    umask?: number;
}): T extends true ? void : Promise<void>;
