import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Resolves source and destination paths before delegating recursive copy work.
 */
export declare function copy<T extends boolean = false>(this: PoweredFileSystem, src: string, dest: string, options?: {
    sync?: T;
    umask?: number;
}): T extends true ? void : Promise<void>;
