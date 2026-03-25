import type { PoweredFileSystem, Stats } from '../powered-file-system';
/**
 * Returns `lstat` data so symlinks are reported as links instead of followed targets.
 */
export declare function stat<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
}): T extends true ? Stats : Promise<Stats>;
