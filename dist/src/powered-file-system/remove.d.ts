import type { PoweredFileSystem } from '../powered-file-system';
export declare function remove<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
}): T extends true ? void : Promise<void>;
