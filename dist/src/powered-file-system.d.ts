/// <reference types="node" />
/// <reference types="node" />
import fs from 'node:fs';
export type Mode = keyof IConstants;
export type Flag = Mode | 'a';
export type Stats = fs.Stats;
export interface IConstants {
    e: number;
    r: number;
    w: number;
    x: number;
}
export declare function bitmask(mode: number): number;
export declare class PoweredFileSystem {
    readonly pwd: string;
    readonly constants: IConstants;
    static bitmask: typeof bitmask;
    constructor(pwd?: string);
    private resolve;
    test(src: string, options: {
        sync: true;
        flag?: Mode;
    }): boolean;
    test(src: string, options?: {
        sync?: false;
        flag?: Mode;
    }): Promise<boolean>;
    stat(src: string, options: {
        sync: true;
    }): Stats;
    stat(src: string, options?: {
        sync?: false;
    }): Promise<Stats>;
    chmod(src: string, mode: number, options: {
        sync: true;
    }): void;
    chmod(src: string, mode: number, options?: {
        sync?: false;
    }): Promise<void>;
    chown(src: string, uid: number, gid: number, options: {
        sync: true;
    }): void;
    chown(src: string, uid: number, gid: number, options?: {
        sync?: false;
    }): Promise<void>;
    symlink(src: string, use: string, options: {
        sync: true;
    }): void;
    symlink(src: string, use: string, options?: {
        sync?: false;
    }): Promise<void>;
    copy(src: string, dir: string, options: {
        sync: true;
        umask?: number;
    }): void;
    copy(src: string, dir: string, options?: {
        sync?: false;
        umask?: number;
    }): Promise<void>;
    rename(src: string, use: string, options: {
        sync: true;
    }): void;
    rename(src: string, use: string, options?: {
        sync?: false;
    }): Promise<void>;
    remove(src: string, options: {
        sync: true;
    }): void;
    remove(src: string, options?: {
        sync?: false;
    }): Promise<void>;
    read(src: string, options: {
        sync: true;
        encoding?: BufferEncoding;
        flag?: Flag;
    }): string;
    read(src: string, options: {
        sync: true;
        encoding?: null;
        flag?: Flag;
    }): Buffer;
    read(src: string, options: {
        sync?: false;
        encoding: null;
        flag?: Flag;
    }): Promise<Buffer>;
    read(src: string, options?: {
        sync?: false;
        encoding?: BufferEncoding;
        flag?: Flag;
    }): Promise<string>;
    write(src: string, data: Buffer, options: {
        sync: true;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): void;
    write(src: string, data: string, options: {
        sync: true;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): void;
    write(src: string, data: Buffer, options: {
        sync?: false;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    write(src: string, data: string, options?: {
        sync?: false;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    append(src: string, data: Buffer, options: {
        sync: true;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): void;
    append(src: string, data: string, options: {
        sync: true;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): void;
    append(src: string, data: Buffer, options: {
        sync?: false;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    append(src: string, data: string, options?: {
        sync?: false;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    readdir(dir: string, options: {
        sync: true;
        encoding?: BufferEncoding | null;
    }): string[];
    readdir(dir: string, options?: {
        sync?: false;
        encoding?: BufferEncoding | null;
    }): Promise<string[]>;
    mkdir(dir: string, options: {
        sync: true;
        umask?: number;
    }): void;
    mkdir(dir: string, options?: {
        sync?: false;
        umask?: number;
    }): Promise<void>;
}
