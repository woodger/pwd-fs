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
describe('stat(src [, options])', () => {
    beforeEach(() => {
        const chance = new chance_1.default();
        (0, mock_fs_1.default)({
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
    it('Positive: Must return information a file', async () => {
        const pfs = new src_1.default();
        const stats = await pfs.stat('./tmpdir/binapp');
        (0, assert_1.default)(stats.isFile());
    });
    it('Positive: Must return information a directory', async () => {
        const pfs = new src_1.default();
        const stats = await pfs.stat('./tmpdir/libxbase');
        (0, assert_1.default)(stats.isDirectory());
    });
    it('Positive: Must return information a symlink', async () => {
        const pfs = new src_1.default();
        const stats = await pfs.stat('./flexapp');
        (0, assert_1.default)(stats.isSymbolicLink());
    });
    it('Positive: Must return stats information, when path is absolute', async () => {
        const pfs = new src_1.default();
        const cwd = process.cwd();
        const stats = await pfs.stat(`${cwd}${path_1.sep}tmpdir`, {
            resolve: false
        });
        (0, assert_1.default)(stats.isDirectory());
    });
    it('Negative: Throw if not exists resource', async () => {
        const pfs = new src_1.default();
        const chance = new chance_1.default();
        const base = chance.guid();
        try {
            await pfs.stat(`./${base}`);
        }
        catch (err) {
            (0, assert_1.default)(err.errno === -2);
        }
    });
    describe('sync mode', () => {
        it('Positive: Must return information a file', async () => {
            const pfs = new src_1.default();
            const stats = pfs.stat('./tmpdir/binapp', {
                sync: true
            });
            (0, assert_1.default)(stats.isFile());
        });
        it('Positive: Must return information a directory in ', async () => {
            const pfs = new src_1.default();
            const stats = pfs.stat('./tmpdir/libxbase', {
                sync: true
            });
            (0, assert_1.default)(stats.isDirectory());
        });
        it('Positive: Must return information a symlink', async () => {
            const pfs = new src_1.default();
            const stats = pfs.stat('./flexapp', {
                sync: true
            });
            (0, assert_1.default)(stats.isSymbolicLink());
        });
        it('Positive: Must return stats information, when path is absolute', async () => {
            const pfs = new src_1.default();
            const cwd = process.cwd();
            const stats = pfs.stat(`${cwd}${path_1.sep}tmpdir`, {
                sync: true,
                resolve: false
            });
            (0, assert_1.default)(stats.isDirectory());
        });
        it('Negative: Throw if not exists resource', async () => {
            const pfs = new src_1.default();
            const chance = new chance_1.default();
            const base = chance.guid();
            try {
                pfs.stat(`./${base}`, {
                    sync: true
                });
            }
            catch (err) {
                (0, assert_1.default)(err.errno === -2);
            }
        });
    });
});
