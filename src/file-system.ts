import fs from 'fs';

type Files = Array<string>;
type Flag = 'a' | 'e' | 'r' | 'w' | 'x';

interface Stats extends fs.Stats {
  bitmask: number
}

export declare namespace FileSystem {
  interface PoweredFileSystem {
    test(src: string, options: { sync: true, resolve?: boolean, flag: Flag }): boolean;
    test(src: string, options?: { sync?: false, resolve?: boolean, flag: Flag }): Promise<boolean>;

    stat(src: string, options: { sync: true, resolve?: boolean }): Stats;
    stat(src: string, options?: { sync?: false, resolve?: boolean }): Promise<Stats>;

    chmod(src: string, mode: number, options: { sync: true, resolve?: boolean }): void;
    chmod(src: string, mode: number, options?: { sync?: false, resolve?: boolean }): Promise<void>;

    chown(src: string, uid: number, gid: number, options: { sync: true, resolve?: boolean }): void;
    chown(src: string, uid: number, gid: number, options?: { sync?: false, resolve?: boolean }): Promise<void>;

    symlink(src: string, use: string, options: { sync: true, resolve?: boolean }): void;
    symlink(src: string, use: string, options?: { sync?: false, resolve?: boolean }): Promise<void>;

    copy(src: string, dir: string, options: { sync: true, resolve?: boolean, umask: number }): void;
    copy(src: string, dir: string, options?: { sync?: false, resolve?: boolean, umask: number }): Promise<void>;

    rename(src: string, use: string, options: { sync: true, resolve?: boolean }): void;
    rename(src: string, use: string, options?: { sync?: false, resolve?: boolean }): Promise<void>;

    remove(src: string, options: { sync: true, resolve?: boolean }): void;
    remove(src: string, options?: { sync?: false, resolve?: boolean }): Promise<void>;

    read(src: string, options: { sync: true, resolve?: boolean, encoding?: BufferEncoding | null, flag?: Flag }): string | Buffer;
    read(src: string, options?: { sync?: false, resolve?: boolean, encoding?: BufferEncoding | null, flag?: Flag }): Promise<string | Buffer>;

    write(src: string, data: Buffer | string, options: { sync: true, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number, flag?: Flag }): void;
    write(src: string, data: Buffer | string, options?: { sync?: false, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number, flag?: Flag }): Promise<void>;

    append(src: string, data: Buffer | string, options: { sync: true, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number, flag?: Flag }): void;
    append(src: string, data: Buffer | string, options?: { sync?: false, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number, flag?: Flag }): Promise<void>;

    readdir(dir: string, options: { sync: true, resolve?: boolean, encoding?: BufferEncoding | null }): Files;
    readdir(dir: string, options?: { sync?: false, resolve?: boolean, encoding?: BufferEncoding | null }): Promise<Files>;

    mkdir(dir: string, options: { sync: true, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number }): void;
    mkdir(dir: string, options?: { sync?: false, resolve?: boolean, encoding?: BufferEncoding | null, umask?: number }): Promise<void>;
  }
}
