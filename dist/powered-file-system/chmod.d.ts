import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Resolves the target path and delegates recursive mode updates.
 */
export declare function chmod<T extends boolean = false>(this: PoweredFileSystem, src: string, mode: number, options?: {
    sync?: T;
}): T extends true ? void : Promise<void>;
