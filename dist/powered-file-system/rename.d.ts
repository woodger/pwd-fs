import type { PoweredFileSystem } from '../powered-file-system';
/**
 * Resolves both paths against the instance root before delegating to Node's rename API.
 */
export declare function rename<T extends boolean = false>(this: PoweredFileSystem, src: string, dest: string, options?: {
    sync?: T;
}): T extends true ? void : Promise<void>;
