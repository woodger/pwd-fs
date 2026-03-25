import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Removes a path relative to the instance root, preferring native recursive APIs when available.
 */
export declare function remove<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
}): T extends true ? void : Promise<void>;
