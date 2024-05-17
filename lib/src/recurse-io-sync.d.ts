declare function chmod(src: string, mode: number): void;
declare function chown(src: string, uid: number, gid: number): void;
declare function copy(src: string, dir: string, umask: number): void;
declare function remove(src: string): void;
declare function mkdir(dir: string, umask: number): void;
declare const _default: {
    chmod: typeof chmod;
    chown: typeof chown;
    copy: typeof copy;
    remove: typeof remove;
    mkdir: typeof mkdir;
};
export default _default;
