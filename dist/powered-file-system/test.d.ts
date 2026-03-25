import type { Mode, PoweredFileSystem } from '../powered-file-system';
export declare function test<T extends boolean = false>(this: PoweredFileSystem, src: string, options?: {
    sync?: T;
    flag?: Mode;
}): T extends true ? boolean : Promise<boolean>;
