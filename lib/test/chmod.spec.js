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
describe('chmod(src, mode [, options])', () => {
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
    it('Positive: Changes directory and file permissions', async () => {
        const pfs = new src_1.default();
        await pfs.chmod('./tmpdir', 0o744);
        const { mode } = await pfs.stat('./tmpdir/binapp');
        const umask = src_1.default.bitmask(mode);
        assert_1.default(umask === 0o744);
    });
    it('Positive: Must be changes directory when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        await pfs.chmod(`${cwd}${path_1.sep}tmpdir${path_1.sep}libxbase`, 0o744, {
            resolve: false
        });
        const { mode } = await pfs.stat('./tmpdir/libxbase');
        const umask = src_1.default.bitmask(mode);
        assert_1.default(umask === 0o744);
    });
    it('Negative: Search permission is denied on a component of the path prefix', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.chmod('./tmpdir', 0);
        }
        catch (err) {
            assert_1.default(err.errno === -9);
        }
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        try {
            await pfs.chmod('./non-existent-source', 0o744);
        }
        catch (err) {
            assert_1.default(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it(`Positive: Changes directory and file permissions`, async () => {
            const pfs = new src_1.default();
            pfs.chmod('./tmpdir', 0o744, {
                sync: true
            });
            const { mode } = await pfs.stat('./tmpdir/binapp');
            const umask = src_1.default.bitmask(mode);
            assert_1.default(umask === 0o744);
        });
        it('Positive: Must be changes directory when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            pfs.chmod(`${cwd}${path_1.sep}tmpdir${path_1.sep}libxbase`, 0o744, {
                sync: true,
                resolve: false
            });
            const { mode } = await pfs.stat('./tmpdir/libxbase');
            const umask = src_1.default.bitmask(mode);
            assert_1.default(umask === 0o744);
        });
        it('Negative: Search permission is denied on a component of the path prefix', async () => {
            const pfs = new src_1.default();
            try {
                pfs.chmod('./tmpdir', 0, {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -9);
            }
        });
        it('Negative: Throw if not exists resource', async () => {
            const pfs = new src_1.default();
            try {
                pfs.chmod('./non-existent-source', 0o744, {
                    sync: true
                });
            }
            catch (err) {
                assert_1.default(err.errno === -2);
            }
        });
    });
});
//# sourceMappingURL=chmod.spec.js.map