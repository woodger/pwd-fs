import type { Mode, PoweredFileSystem } from '../powered-file-system';
/**
 * Thin wrapper around `fs.access` that resolves paths against the instance root.
 */
export declare function test<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    flag?: Mode;
}): T extends true ? boolean : Promise<boolean>;
