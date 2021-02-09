declare const _default: {
    chmod(src: string, mode: number): void;
    chown(src: string, uid: number, gid: number): void;
    copy(src: string, dir: string, umask: number): void;
    remove(src: string): void;
    mkdir(dir: string, umask: number): void;
};
export default _default;
