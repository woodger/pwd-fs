import type { PoweredFileSystem, Stats } from '../powered-file-system';
export declare function stat<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
}): T extends true ? Stats : Promise<Stats>;
