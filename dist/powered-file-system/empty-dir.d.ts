import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Removes directory contents while preserving the directory itself.
 */
export declare function emptyDir<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
}): T extends true ? void : Promise<void>;
