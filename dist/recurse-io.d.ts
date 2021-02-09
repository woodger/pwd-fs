declare const _default: {
    chmod(src: string, mode: number, callback: (err: Error) => void): void;
    chown(src: string, uid: number, gid: number, callback: (err: Error) => void): void;
    copy(src: string, dir: string, umask: number, callback: (err: Error) => void): void;
    remove(src: string, callback: (err: Error) => void): void;
    mkdir(dir: string, umask: number, callback: (err: Error) => void): void;
};
export default _default;
