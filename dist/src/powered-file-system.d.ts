import fs from 'node:fs';
import { bitmask } from './bitmask';
export type Mode = keyof IConstants;
export type Flag = Mode | 'a';
export type Stats = fs.Stats;
export * from './bitmask';
export interface IConstants {
    e: number;
    r: number;
    w: number;
    x: number;
}
export declare class PoweredFileSystem {
    readonly pwd: string;
    readonly constants: IConstants;
    static bitmask: typeof bitmask;
    constructor(pwd?: string);
    private resolve;
    test<T extends boolean = false>(src: string, options?: {
        sync?: T;
        flag?: Mode;
    }): T extends true ? boolean : Promise<boolean>;
    stat<T extends boolean = false>(src: string, options?: {
        sync?: T;
    }): T extends true ? Stats : Promise<Stats>;
    chmod<T extends boolean = false>(src: string, mode: number, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    chown<T extends boolean = false>(src: string, options?: {
        sync?: T;
        uid?: number;
        gid?: number;
    }): T extends true ? void : Promise<void>;
    symlink<T extends boolean = false>(src: string, dest: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    copy<T extends boolean = false>(src: string, dest: string, options?: {
        sync?: T;
        umask?: number;
    }): T extends true ? void : Promise<void>;
    rename<T extends boolean = false>(src: string, dest: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    remove<T extends boolean = false>(src: string, options?: {
        sync?: T;
    }): T extends true ? void : Promise<void>;
    read<T extends boolean = false>(src: string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
        flag?: Flag;
    }): T extends true ? string | Buffer : Promise<string | Buffer>;
    write<T extends boolean = false>(src: string, data: Buffer | string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
        umask?: number;
        flag?: Flag;
    }): T extends true ? void : Promise<void>;
    /**
    * @deprecated The method should not be used
    */
    append<T extends boolean = false>(src: string, data: Buffer | string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
        umask?: number;
    }): T extends true ? void : Promise<void>;
    readdir<T extends boolean = false>(dir: string, options?: {
        sync?: T;
        encoding?: BufferEncoding | null;
    }): T extends true ? string[] : Promise<string[]>;
    mkdir<T extends boolean = false>(dir: string, options?: {
        sync?: T;
        umask?: number;
    }): T extends true ? void : Promise<void>;
}
