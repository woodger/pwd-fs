import fs from 'fs';
declare const _default: {
    chmod(src: string, mode: number, callback: fs.NoParamCallback): void;
    chown(src: string, uid: number, gid: number, callback: fs.NoParamCallback): void;
    copy(src: string, dir: string, umask: number, callback: fs.NoParamCallback): void;
    remove(src: string, callback: fs.NoParamCallback): void;
    mkdir(dir: string, umask: number, callback: fs.NoParamCallback): void;
};
export default _default;
