import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Resolves the target path and applies recursive ownership changes where supported.
 */
export declare function chown<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    uid?: number;
    gid?: number;
}): T extends true ? void : Promise<void>;
