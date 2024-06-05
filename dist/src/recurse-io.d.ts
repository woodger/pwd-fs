/// <reference types="node" />
import { NoParamCallback } from 'node:fs';
export declare function chmod(src: string, mode: number, callback: NoParamCallback): void;
export declare function chown(src: string, uid: number, gid: number, callback: NoParamCallback): void;
export declare function copy(src: string, dir: string, umask: number, callback: NoParamCallback): void;
export declare function remove(src: string, callback: NoParamCallback): void;
export declare function mkdir(dir: string, umask: number, callback: NoParamCallback): void;
