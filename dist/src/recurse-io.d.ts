/// <reference types="node" />
import fs from 'node:fs';
export type Files = Array<string>;
export type NoParamCallback = fs.NoParamCallback;
declare function chmod(src: string, mode: number, callback: NoParamCallback): void;
declare function chown(src: string, uid: number, gid: number, callback: NoParamCallback): void;
declare function copy(src: string, dir: string, umask: number, callback: NoParamCallback): void;
declare function remove(src: string, callback: NoParamCallback): void;
declare function mkdir(dir: string, umask: number, callback: NoParamCallback): void;
declare const _default: {
    chmod: typeof chmod;
    chown: typeof chown;
    copy: typeof copy;
    remove: typeof remove;
    mkdir: typeof mkdir;
};
export default _default;
