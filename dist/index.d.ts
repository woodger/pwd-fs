/// <reference types="node" />
import fs from 'fs';
declare type Files = Array<string>;
declare class PoweredFileSystem {
    #private;
    readonly pwd: string;
    constructor(pwd?: string);
    static bitmask(mode: number): number;
    test(src: string, { flag, resolve, sync }?: {
        flag?: string;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<boolean> | boolean;
    stat(src: string, { resolve, sync }?: {
        resolve?: boolean;
        sync?: boolean;
    }): Promise<fs.Stats> | fs.Stats;
    chmod(src: string, mode: number, { resolve, sync }?: {
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    chown(src: string, uid: number, gid: number, { resolve, sync }?: {
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    symlink(src: string, use: string, { resolve, sync }?: {
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    copy(src: string, dir: string, { umask, resolve, sync }?: {
        umask?: number;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    rename(src: string, use: string, { resolve, sync }?: {
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    remove(src: string, { resolve, sync }?: {
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    read(src: string, { encoding, flag, resolve, sync }?: {
        encoding?: BufferEncoding | null;
        flag?: string;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<string> | string;
    write(src: string, data: string, { encoding, umask, flag, resolve, sync }?: {
        encoding?: BufferEncoding | null;
        umask?: number;
        flag?: string;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    append(src: string, data: string, { encoding, umask, flag, resolve, sync }?: {
        encoding?: BufferEncoding | null;
        umask?: number;
        flag?: string;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
    readdir(dir: string, { encoding, resolve, sync }?: {
        encoding?: BufferEncoding | null;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<Files> | Files;
    mkdir(dir: string, { umask, resolve, sync }?: {
        umask?: number;
        resolve?: boolean;
        sync?: boolean;
    }): Promise<void> | void;
}
export = PoweredFileSystem;
