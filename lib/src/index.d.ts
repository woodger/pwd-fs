/// <reference types="node" />
import fs from 'fs';
declare type Flag = 'a' | 'e' | 'r' | 'w' | 'x';
interface Constants {
    [key: string]: number;
}
export default class PoweredFileSystem {
    readonly pwd: string;
    readonly constants: Constants;
    constructor(pwd?: string);
    test(src: string, options: {
        sync: true;
        resolve?: boolean;
        flag?: Flag;
    }): boolean;
    test(src: string, options?: {
        sync?: false;
        resolve?: boolean;
        flag?: Flag;
    }): Promise<boolean>;
    stat(src: string, options: {
        sync: true;
        resolve?: boolean;
    }): fs.Stats;
    stat(src: string, options?: {
        sync?: false;
        resolve?: boolean;
    }): Promise<fs.Stats>;
    chmod(src: string, mode: number, options: {
        sync: true;
        resolve?: boolean;
    }): void;
    chmod(src: string, mode: number, options?: {
        sync?: false;
        resolve?: boolean;
    }): Promise<void>;
    chown(src: string, uid: number, gid: number, options: {
        sync: true;
        resolve?: boolean;
    }): void;
    chown(src: string, uid: number, gid: number, options?: {
        sync?: false;
        resolve?: boolean;
    }): Promise<void>;
    symlink(src: string, use: string, options: {
        sync: true;
        resolve?: boolean;
    }): void;
    symlink(src: string, use: string, options?: {
        sync?: false;
        resolve?: boolean;
    }): Promise<void>;
    copy(src: string, dir: string, options: {
        sync: true;
        resolve?: boolean;
        umask?: number;
    }): void;
    copy(src: string, dir: string, options?: {
        sync?: false;
        resolve?: boolean;
        umask?: number;
    }): Promise<void>;
    rename(src: string, use: string, options: {
        sync: true;
        resolve?: boolean;
    }): void;
    rename(src: string, use: string, options?: {
        sync?: false;
        resolve?: boolean;
    }): Promise<void>;
    remove(src: string, options: {
        sync: true;
        resolve?: boolean;
    }): void;
    remove(src: string, options?: {
        sync?: false;
        resolve?: boolean;
    }): Promise<void>;
    read(src: string, options: {
        sync: true;
        resolve?: boolean;
        encoding?: BufferEncoding;
        flag?: Flag;
    }): string;
    read(src: string, options: {
        sync: true;
        resolve?: boolean;
        encoding?: null;
        flag?: Flag;
    }): Buffer;
    read(src: string, options: {
        sync?: false;
        resolve?: boolean;
        encoding: null;
        flag?: Flag;
    }): Promise<Buffer>;
    read(src: string, options?: {
        sync?: false;
        resolve?: boolean;
        encoding?: BufferEncoding;
        flag?: Flag;
    }): Promise<string>;
    write(src: string, data: Buffer, options: {
        sync: true;
        resolve?: boolean;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): void;
    write(src: string, data: string, options: {
        sync: true;
        resolve?: boolean;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): void;
    write(src: string, data: Buffer, options: {
        sync?: false;
        resolve?: boolean;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    write(src: string, data: string, options?: {
        sync?: false;
        resolve?: boolean;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    append(src: string, data: Buffer, options: {
        sync: true;
        resolve?: boolean;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): void;
    append(src: string, data: string, options: {
        sync: true;
        resolve?: boolean;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): void;
    append(src: string, data: Buffer, options: {
        sync?: false;
        resolve?: boolean;
        encoding: null;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    append(src: string, data: string, options?: {
        sync?: false;
        resolve?: boolean;
        encoding?: BufferEncoding;
        umask?: number;
        flag?: Flag;
    }): Promise<void>;
    readdir(dir: string, options: {
        sync: true;
        resolve?: boolean;
        encoding?: BufferEncoding | null;
    }): string[];
    readdir(dir: string, options?: {
        sync?: false;
        resolve?: boolean;
        encoding?: BufferEncoding | null;
    }): Promise<string[]>;
    mkdir(dir: string, options: {
        sync: true;
        resolve?: boolean;
        umask?: number;
    }): void;
    mkdir(dir: string, options?: {
        sync?: false;
        resolve?: boolean;
        umask?: number;
    }): Promise<void>;
    private resolve;
    static bitmask(mode: number): number;
}
export {};
