import type { PoweredFileSystem } from '../powered-file-system';
export declare function copy<T extends boolean = false>(this: PoweredFileSystem, src: string, dest: string, options?: {
    sync?: T;
    umask?: number;
}): T extends true ? void : Promise<void>;
