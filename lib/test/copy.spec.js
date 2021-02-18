"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const mock_fs_1 = __importDefault(require("mock-fs"));
const chance_1 = __importDefault(require("chance"));
const src_1 = __importDefault(require("../src"));
describe('copy(src, dir [, options])', () => {
    beforeEach(() => {
        const chance = new chance_1.default();
        mock_fs_1.default({
            'tmpdir': {
                'binapp': chance.string(),
                'libxbase': mock_fs_1.default.directory()
            },
            'flexapp': mock_fs_1.default.symlink({
                path: 'tmpdir/binapp'
            })
        });
    });
    afterEach(mock_fs_1.default.restore);
    it('Positive: Copying a item file', async () => {
        const pfs = new src_1.default();
        const dist = os_1.default.tmpdir();
        await pfs.copy('./tmpdir/binapp', dist);
        const { mode } = await pfs.stat(`${dist}/binapp`);
        const umask = src_1.default.bitmask(mode);
        assert_1.default(umask === 0o666);
    });
    it('Positive: Recursive copying a directory', async () => {
        const pfs = new src_1.default();
        const dist = os_1.default.tmpdir();
        await pfs.copy('./tmpdir', dist);
        const { mode } = await pfs.stat(`${dist}/tmpdir/libxbase`);
        const umask = src_1.default.bitmask(mode);
        assert_1.default(umask === 0o777);
    });
    it('Positive: Recursive copying a directory. Permission check of file', async () => {
        const pfs = new src_1.default();
        const dist = os_1.default.tmpdir();
        await pfs.copy('./tmpdir', dist);
        const { mode } = await pfs.stat(`${dist}/tmpdir/binapp`);
        const umask = src_1.default.bitmask(mode);
        assert_1.default(umask === 0o666);
    });
    it('Positive: Copying a item file when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        const dist = os_1.default.tmpdir();
        await pfs.copy(`${cwd}${path_1.sep}tmpdir`, dist, {
            resolve: false
        });
        const { mode } = await pfs.stat(`${dist}/tmpdir/binapp`);
        const umask = src_1.default.bitmask(mode);
        assert_1.default(umask === 0o666);
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.copy('./non-existent', '.');
        }
        catch (err) {
            assert_1.default(err.errno === -2);
        }
    });
    it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.copy('./tmpdir', '.');
        }
        catch (err) {
            assert_1.default(err.errno === -17);
        }
    });
    describe('sync mode', () => {
        it('Positive: Copying a file', async () => {
            const pfs = new src_1.default();
            const dist = os_1.default.tmpdir();
            pfs.copy('./tmpdir/binapp', dist, {
                sync: true
            });
            const { mode } = await pfs.stat(`${dist}/binapp`);
            const umask = src_1.default.bitmask(mode);
            assert_1.default(umask === 0o666);
        });
        it('Positive: Recursive copying a directory', async () => {
            const pfs = new src_1.default();
            const dist = os_1.default.tmpdir();
            pfs.copy('./tmpdir', dist, {
                sync: true
            });
            const { mode } = await pfs.stat(`${dist}/tmpdir/libxbase`);
            const umask = src_1.default.bitmask(mode);
            assert_1.default(umask === 0o777);
        });
        it('Positive: Copying a item file when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            const dist = os_1.default.tmpdir();
            pfs.copy(`${cwd}${path_1.sep}tmpdir`, dist, {
                sync: true,
                resolve: false
            });
            const { mode } = await pfs.stat(`${dist}/tmpdir/binapp`);
            const umask = src_1.default.bitmask(mode);
            assert_1.default(umask === 0o666);
        });
        it('Negative: Throw if not exists resource', async () => {
            const pfs = new src_1.default();
            try {
                pfs.copy('./non-existent', '.', {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -2);
            }
        });
        it('Negative: An attempt to copy to an existing resource should return an Error', async () => {
            const pfs = new src_1.default();
            try {
                pfs.copy('./tmpdir', '.', {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -17);
            }
        });
    });
});
//# sourceMappingURL=copy.spec.js.map