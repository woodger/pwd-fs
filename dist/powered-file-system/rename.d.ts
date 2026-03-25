import type { PoweredFileSystem } from '../powered-file-system';
export declare function rename<T extends boolean = false>(this: PoweredFileSystem, src: string, dest: string, options?: {
    sync?: T;
}): T extends true ? void : Promise<void>;
