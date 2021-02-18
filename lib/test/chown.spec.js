"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const path_1 = require("path");
const mock_fs_1 = __importDefault(require("mock-fs"));
const chance_1 = __importDefault(require("chance"));
const src_1 = __importDefault(require("../src"));
describe('chown(src, uid, gid [, options])', () => {
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
    it('Positive: Changes the permissions of a file', async () => {
        const pfs = new src_1.default();
        await pfs.chown('./tmpdir', 0, 0);
        const { uid, gid } = await pfs.stat('./tmpdir');
        assert_1.default(uid === 0 && gid === 0);
    });
    it('Positive: Changes the permissions of a directory', async () => {
        const pfs = new src_1.default();
        await pfs.chown('./tmpdir/libxbase', 0, 0);
        const { uid, gid } = await pfs.stat('./tmpdir/libxbase');
        assert_1.default(uid === 0 && gid === 0);
    });
    it('Positive: Changes the permissions of a file, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        await pfs.chown(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, 1, 1, {
            resolve: false
        });
        const { uid, gid } = await pfs.stat('./tmpdir/binapp');
        assert_1.default(uid === 1 && gid === 1);
    });
    it('Negative: To a non-existent resource to return an Error', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.chown('./non-existent-source', 1, 1);
        }
        catch (err) {
            assert_1.default(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Changes the permissions of a file', async () => {
            const pfs = new src_1.default();
            pfs.chown('./tmpdir/binapp', 1, 1, {
                sync: true
            });
            const { uid, gid } = await pfs.stat('./tmpdir/binapp');
            assert_1.default(uid === 1 && gid === 1);
        });
        it('Positive: Changes the permissions of a directory', async () => {
            const pfs = new src_1.default();
            pfs.chown('./tmpdir', 1, 1, {
                sync: true
            });
            const { uid, gid } = await pfs.stat('./tmpdir');
            assert_1.default(uid === 1 && gid === 1);
        });
        it('Positive: Changes the permissions of a file, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            pfs.chown(`${cwd}${path_1.sep}tmpdir${path_1.sep}binapp`, 1, 1, {
                sync: true,
                resolve: false
            });
            const { uid, gid } = await pfs.stat('./tmpdir/binapp');
            assert_1.default(uid === 1 && gid === 1);
        });
        it(`Negative: To a non-existent resource to return an Error`, async () => {
            const pfs = new src_1.default();
            try {
                pfs.chown('./non-existent-source', 1, 1, {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -2);
            }
        });
    });
});
//# sourceMappingURL=chown.spec.js.map