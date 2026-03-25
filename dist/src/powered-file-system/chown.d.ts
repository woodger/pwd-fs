import type { PoweredFileSystem } from '../powered-file-system';
export declare function chown<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    uid?: number;
    gid?: number;
}): T extends true ? void : Promise<void>;
